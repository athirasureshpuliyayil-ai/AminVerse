import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { getToken, getUser } from '../utils/authStorage';
import './StoryTheatre.css';

const BACKGROUNDS = [
  ['stage', 'Velvet stage'], ['forest', 'Enchanted forest'], ['castle', 'Old castle'],
  ['night', 'Moonlit night'], ['meadow', 'Open meadow'], ['ocean', 'Deep ocean'], ['library', 'Old library']
];
const POSITIONS = ['left', 'center', 'right'];
const initialTheatre = {
  characters: [{ name: 'Narrator', role: 'Storyteller', appearance: 'A quiet voice from the wings', illustration: '🎭', color: '#F59E0B', position: 'center' }],
  scenes: [{ title: 'Opening scene', background: 'stage', dialogues: [{ speaker: 'Narrator', text: '' }] }],
  isPublished: true
};

function requestHeaders(json = false) {
  const headers = { Authorization: `Bearer ${getToken()}` };
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

function Stage({ scene, characters, speaker }) {
  return (
    <div className={`theatre-stage theatre-stage--${scene?.background || 'stage'}`} style={scene?.backgroundImage ? { backgroundImage: `linear-gradient(180deg, rgba(7,10,14,.12), rgba(7,10,14,.58)), url("${scene.backgroundImage}")` } : undefined}>
      <div className="theatre-curtain theatre-curtain--left" />
      <div className="theatre-curtain theatre-curtain--right" />
      <div className="theatre-stage-lights" />
      <div className="theatre-performers">
        {characters.map(character => (
          <div
            className={`theatre-character theatre-character--${character.position}${speaker === character.name ? ' is-speaking' : ''}`}
            key={character._id || character.name}
            style={{ '--character-color': character.color || '#F59E0B' }}
          >
            <span className="theatre-character-art" aria-hidden="true">{character.illustration || '🎭'}</span>
            <strong>{character.name}</strong>
            {character.role && <small>{character.role}</small>}
          </div>
        ))}
      </div>
      <div className="theatre-stage-floor" />
    </div>
  );
}

export function StoryTheatreEditor() {
  const { storyId } = useParams();
  const user = getUser();
  const [story, setStory] = useState(null);
  const [performance, setPerformance] = useState(initialTheatre);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.role !== 'author') return;
    fetch(`/api/theatre/edit/${storyId}`, { headers: requestHeaders() })
      .then(async response => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || 'Unable to open theatre editor.');
        setStory(payload.story);
        if (payload.data) setPerformance({
          characters: payload.data.characters || [],
          scenes: payload.data.scenes || [],
          isPublished: payload.data.isPublished
        });
      })
      .catch(loadError => setError(loadError.message))
      .finally(() => setLoading(false));
  }, [storyId, user?.role]);

  const updateCharacter = (index, updates) => setPerformance(current => ({
    ...current,
    characters: current.characters.map((character, itemIndex) => itemIndex === index ? { ...character, ...updates } : character)
  }));
  const updateScene = (index, updates) => setPerformance(current => ({
    ...current,
    scenes: current.scenes.map((scene, itemIndex) => itemIndex === index ? { ...scene, ...updates } : scene)
  }));
  const updateDialogue = (sceneIndex, lineIndex, updates) => setPerformance(current => ({
    ...current,
    scenes: current.scenes.map((scene, itemIndex) => itemIndex === sceneIndex ? {
      ...scene,
      dialogues: scene.dialogues.map((line, dialogueIndex) => dialogueIndex === lineIndex ? { ...line, ...updates } : line)
    } : scene)
  }));

  const moveScene = (index, direction) => setPerformance(current => {
    const scenes = [...current.scenes];
    const destination = index + direction;
    if (destination < 0 || destination >= scenes.length) return current;
    [scenes[index], scenes[destination]] = [scenes[destination], scenes[index]];
    return { ...current, scenes };
  });

  const savePerformance = async event => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const response = await fetch(`/api/theatre/${storyId}`, {
        method: 'PUT',
        headers: requestHeaders(true),
        body: JSON.stringify(performance)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Could not save theatre.');
      setPerformance({ characters: payload.data.characters, scenes: payload.data.scenes, isPublished: payload.data.isPublished });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2800);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (user?.role && user.role !== 'author') return <Navigate to="/dashboard" replace />;

  if (loading) return <AppShell title="Story Theatre"><p className="theatre-notice">Opening the rehearsal room…</p></AppShell>;
  if (!story) return <AppShell title="Story Theatre"><div className="theatre-notice theatre-notice--error">{error || 'This story is not available in your author workspace.'}</div></AppShell>;

  return (
    <AppShell title="Story Theatre Studio">
      <main className="theatre-editor">
        <header className="theatre-editor-header">
          <div>
            <Link className="theatre-back-link" to="/dashboard/author">← Author workspace</Link>
            <span className="theatre-kicker">STORY THEATRE / REHEARSAL STUDIO</span>
            <h1>{story.title}</h1>
            <p>Arrange your cast, set each scene, and place the dialogue in performance order.</p>
          </div>
          {story.isPublished && <Link className="theatre-preview-link" to={`/stories/${storyId}/theatre`} target="_blank">Preview performance ↗</Link>}
        </header>

        {error && <div className="theatre-notice theatre-notice--error" role="alert">{error}</div>}
        {saved && <div className="theatre-notice theatre-notice--success" role="status">Theatre saved to this story.</div>}

        <form onSubmit={savePerformance}>
          <section className="theatre-editor-section">
            <div className="theatre-section-heading"><div><span>01 / THE CAST</span><h2>Characters</h2></div><button type="button" className="theatre-add-button" onClick={() => setPerformance(current => ({ ...current, characters: [...current.characters, { name: '', role: '', appearance: '', illustration: '🎭', color: '#F59E0B', position: 'center' }] }))}>＋ Add character</button></div>
            <div className="theatre-cast-editor">
              {performance.characters.map((character, index) => (
                <article className="theatre-character-editor" key={character._id || index}>
                  <div className="theatre-character-editor-head"><span className="theatre-cast-number">CAST {String(index + 1).padStart(2, '0')}</span><button type="button" className="theatre-icon-action" aria-label={`Remove ${character.name || 'character'}`} onClick={() => setPerformance(current => ({ ...current, characters: current.characters.filter((_, itemIndex) => itemIndex !== index) }))}>×</button></div>
                  <div className="theatre-character-fields">
                    <label>Name<input required value={character.name} onChange={event => updateCharacter(index, { name: event.target.value })} maxLength={80} /></label>
                    <label>Role<input value={character.role} onChange={event => updateCharacter(index, { role: event.target.value })} maxLength={120} placeholder="The guide, the visitor…" /></label>
                    <label>Illustration<input value={character.illustration} onChange={event => updateCharacter(index, { illustration: event.target.value })} maxLength={8} aria-label="Character emoji illustration" /></label>
                    <label>Stage position<select value={character.position} onChange={event => updateCharacter(index, { position: event.target.value })}>{POSITIONS.map(position => <option key={position} value={position}>{position[0].toUpperCase() + position.slice(1)}</option>)}</select></label>
                    <label>Costume colour<input type="color" value={character.color || '#F59E0B'} onChange={event => updateCharacter(index, { color: event.target.value })} /></label>
                    <label className="theatre-field-wide">Appearance<input value={character.appearance} onChange={event => updateCharacter(index, { appearance: event.target.value })} maxLength={240} placeholder="A brief visual cue for the performer" /></label>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="theatre-editor-section">
            <div className="theatre-section-heading"><div><span>02 / THE SCRIPT</span><h2>Scenes & dialogue</h2></div><button type="button" className="theatre-add-button" onClick={() => setPerformance(current => ({ ...current, scenes: [...current.scenes, { title: '', background: 'stage', backgroundImage: '', dialogues: [] }] }))}>＋ Add scene</button></div>
            <div className="theatre-scene-editor-list">
              {performance.scenes.map((scene, sceneIndex) => (
                <article className="theatre-scene-editor" key={scene._id || sceneIndex}>
                  <div className="theatre-scene-editor-heading">
                    <span className="theatre-scene-number">SCENE {String(sceneIndex + 1).padStart(2, '0')}</span>
                    <div className="theatre-scene-order">
                      <button type="button" disabled={sceneIndex === 0} aria-label="Move scene up" onClick={() => moveScene(sceneIndex, -1)}>↑</button>
                      <button type="button" disabled={sceneIndex === performance.scenes.length - 1} aria-label="Move scene down" onClick={() => moveScene(sceneIndex, 1)}>↓</button>
                      <button type="button" className="theatre-icon-action" aria-label="Remove scene" onClick={() => setPerformance(current => ({ ...current, scenes: current.scenes.filter((_, itemIndex) => itemIndex !== sceneIndex) }))}>×</button>
                    </div>
                  </div>
                  <div className="theatre-scene-settings">
                    <label>Scene title<input value={scene.title} onChange={event => updateScene(sceneIndex, { title: event.target.value })} maxLength={120} placeholder={`Scene ${sceneIndex + 1}`} /></label>
                    <label>Stage background<select value={scene.background} onChange={event => updateScene(sceneIndex, { background: event.target.value })}>{BACKGROUNDS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
                    <label className="theatre-field-wide">Background image URL (optional)<input type="url" value={scene.backgroundImage || ''} onChange={event => updateScene(sceneIndex, { backgroundImage: event.target.value })} placeholder="https://…" /></label>
                  </div>
                  <div className="theatre-dialogue-heading"><h3>Dialogue</h3><button type="button" className="theatre-text-button" onClick={() => updateScene(sceneIndex, { dialogues: [...scene.dialogues, { speaker: '', text: '' }] })}>＋ Add line</button></div>
                  {(scene.dialogues || []).map((line, lineIndex) => (
                    <div className="theatre-dialogue-editor" key={line._id || lineIndex}>
                      <label>Speaker<select value={line.speaker || ''} onChange={event => updateDialogue(sceneIndex, lineIndex, { speaker: event.target.value })}><option value="">Stage direction / narration</option>{performance.characters.map(castMember => <option key={castMember._id || castMember.name} value={castMember.name}>{castMember.name}</option>)}</select></label>
                      <label>Line<textarea required rows="2" maxLength={2000} value={line.text} onChange={event => updateDialogue(sceneIndex, lineIndex, { text: event.target.value })} placeholder="Write this line of dialogue…" /></label>
                      <button type="button" className="theatre-icon-action" aria-label="Remove dialogue" onClick={() => updateScene(sceneIndex, { dialogues: scene.dialogues.filter((_, itemIndex) => itemIndex !== lineIndex) })}>×</button>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </section>

          <footer className="theatre-save-bar">
            <label className="theatre-publish-toggle"><input type="checkbox" checked={performance.isPublished} onChange={event => setPerformance(current => ({ ...current, isPublished: event.target.checked }))} /> Publish theatre for readers</label>
            <button type="submit" className="theatre-save-button" disabled={saving}>{saving ? 'Saving…' : 'Save theatre'}</button>
          </footer>
        </form>
      </main>
    </AppShell>
  );
}

export function StoryTheatrePlayer() {
  const { id: storyId } = useParams();
  const [performance, setPerformance] = useState(null);
  const [story, setStory] = useState(null);
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/theatre/story/${storyId}`, { headers: requestHeaders() })
      .then(async response => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || 'Theatre could not be opened.');
        setPerformance(payload.data);
        setStory(payload.data.story);
      })
      .catch(loadError => setError(loadError.message))
      .finally(() => setLoading(false));
  }, [storyId]);

  const lines = useMemo(() => (performance?.scenes || []).flatMap((scene, sceneIndex) => (scene.dialogues || []).map((line, lineIndex) => ({ ...line, scene, sceneIndex, lineIndex }))), [performance]);
  const current = lines[index];
  const advance = useCallback((amount = 1) => setIndex(previous => Math.min(Math.max(0, previous + amount), Math.max(lines.length - 1, 0))), [lines.length]);

  useEffect(() => {
    if (!autoPlay || !lines.length) return undefined;
    const timer = window.setInterval(() => setIndex(previous => {
      if (previous >= lines.length - 1) {
        setAutoPlay(false);
        return previous;
      }
      return previous + 1;
    }), 5000);
    return () => window.clearInterval(timer);
  }, [autoPlay, lines.length]);

  if (loading) return <AppShell title="Story Theatre"><p className="theatre-notice">The curtain is rising…</p></AppShell>;
  if (error || !performance) return <AppShell title="Story Theatre"><div className="theatre-notice theatre-notice--error">{error || 'This theatre is not available.'}</div></AppShell>;
  if (!lines.length || !performance.scenes.length) return <AppShell title="Story Theatre"><div className="theatre-notice">This performance does not have any dialogue yet.</div></AppShell>;

  const scene = current?.scene || performance.scenes[0];
  const speaking = current?.speaker || '';
  const activeCharacter = performance.characters.find(character => character.name === speaking);

  return (
    <div className="theatre-player-page">
      <header className="theatre-player-topbar"><Link to={`/stories/${storyId}`}>← Back to story</Link><span>ANIMVERSE / STORY THEATRE</span><span>{story?.language || 'Original performance'}</span></header>
      <main className="theatre-player-main">
        <div className="theatre-player-title"><span>SCENE {String((current?.sceneIndex || 0) + 1).padStart(2, '0')} / {String(performance.scenes.length).padStart(2, '0')}</span><h1>{story?.title || 'Story Theatre'}</h1><p>{scene.title || `Scene ${(current?.sceneIndex || 0) + 1}`}</p></div>
        <Stage key={scene._id || current?.sceneIndex} scene={scene} characters={performance.characters} speaker={speaking} />
        <section className="theatre-script-panel" aria-live="polite">
          <div className="theatre-script-meta"><span>{activeCharacter?.role || (speaking ? 'IN CHARACTER' : 'STAGE DIRECTION')}</span><span>LINE {String(index + 1).padStart(2, '0')} / {String(lines.length).padStart(2, '0')}</span></div>
          <h2>{speaking || 'Narration'}</h2>
          <p key={current?._id || index} className="theatre-dialogue-text">{current?.text}</p>
        </section>
        <nav className="theatre-player-controls" aria-label="Theatre playback controls">
          <button type="button" onClick={() => { setAutoPlay(false); setIndex(0); }}>↺ Restart</button>
          <div className="theatre-step-controls"><button type="button" disabled={index === 0} onClick={() => { setAutoPlay(false); advance(-1); }}>← Previous</button><button type="button" className="theatre-auto-button" aria-pressed={autoPlay} onClick={() => setAutoPlay(value => !value)}>{autoPlay ? 'Ⅱ Pause auto' : '▶ Auto play'}</button><button type="button" disabled={index === lines.length - 1} onClick={() => { setAutoPlay(false); advance(1); }}>Next →</button></div>
          <Link to={`/stories/${storyId}`}>Exit performance</Link>
        </nav>
        <div className="theatre-progress"><span style={{ width: `${((index + 1) / lines.length) * 100}%` }} /></div>
      </main>
    </div>
  );
}
