import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const Logo = ({ name }) => {
    const colors = {
        streamlabs: '#31fbad',
        streamelements: '#ffffff',
        botrix: '#6366f1'
    };
    const color = colors[name] || '#ffffff';

    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    );
};


function App() {
    const [widgets, setWidgets] = useState(() => {
        const saved = localStorage.getItem('widgets');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newWidget, setNewWidget] = useState({ name: '', url: '', bgColor: '#000000', icon: '📺', shortcut: '' });
    const [editingWidget, setEditingWidget] = useState(null);
    const [showHelpLinks, setShowHelpLinks] = useState(true);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);

    const commonEmojis = ['📺', '💬', '🎁', '🔔', '📈', '🎮', '💡', '🔥', '✨', '🏆', '🌈', '⚡'];

    useEffect(() => {
        localStorage.setItem('widgets', JSON.stringify(widgets));
    }, [widgets]);

    const nextWidget = () => {
        if (widgets.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % widgets.length);
    };

    const prevWidget = () => {
        if (widgets.length === 0) return;
        setActiveIndex((prev) => (prev - 1 + widgets.length) % widgets.length);
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if user is typing in an input or modal is open
            if (isModalOpen || editingWidget || document.activeElement.tagName === 'INPUT') return;

            if (widgets.length === 0) return;

            // Global navigation
            if (e.key === 'ArrowRight') {
                nextWidget();
                return;
            } else if (e.key === 'ArrowLeft') {
                prevWidget();
                return;
            }

            // Custom Shortcuts
            const foundIndex = widgets.findIndex(w => w.shortcut && w.shortcut.toLowerCase() === e.key.toLowerCase());
            if (foundIndex !== -1) {
                setActiveIndex(foundIndex);
                return;
            }

            // Default Number keys (only if widget doesn't have a shortcut that overrides it)
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                if (index < widgets.length) {
                    setActiveIndex(index);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [widgets, isModalOpen, editingWidget]);

    const addWidget = (e) => {
        e.preventDefault();
        if (!newWidget.name || !newWidget.url) return;
        const id = Date.now().toString();
        const updated = [...widgets, { ...newWidget, url: newWidget.url.trim(), id }];
        setWidgets(updated);
        setActiveIndex(updated.length - 1);
        setNewWidget({ name: '', url: '', bgColor: '#000000', icon: '📺' });
        setIsModalOpen(false);
    };

    const updateWidget = (e) => {
        e.preventDefault();
        const updated = widgets.map(w => w.id === editingWidget.id ? { ...editingWidget, url: editingWidget.url.trim() } : w);
        setWidgets(updated);
        setEditingWidget(null);
    };

    const removeWidget = (id) => {
        if (window.confirm('¿Eliminar este widget?')) {
            const indexToRemove = widgets.findIndex(w => w.id === id);
            const newWidgets = widgets.filter((w) => w.id !== id);
            setWidgets(newWidgets);

            if (newWidgets.length === 0) {
                setActiveIndex(0);
            } else if (indexToRemove <= activeIndex) {
                setActiveIndex(Math.max(0, activeIndex - (indexToRemove === activeIndex ? 1 : 0)));
            }
        }
    };

    // Drag and Drop Logic
    const handleDragStart = (index) => {
        setDraggedItemIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;

        const newWidgets = [...widgets];
        const itemToMove = newWidgets.splice(draggedItemIndex, 1)[0];
        newWidgets.splice(index, 0, itemToMove);

        // Update active index if it was moved
        if (activeIndex === draggedItemIndex) {
            setActiveIndex(index);
        } else if (draggedItemIndex < activeIndex && index >= activeIndex) {
            setActiveIndex(activeIndex - 1);
        } else if (draggedItemIndex > activeIndex && index <= activeIndex) {
            setActiveIndex(activeIndex + 1);
        }

        setWidgets(newWidgets);
        setDraggedItemIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };

    const activeWidget = widgets[activeIndex];

    const openExternal = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="app-container">
            <header>
                <div className="header-left">
                    <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <h1>Widgets PC</h1>
                </div>
                <div className="header-right">
                    <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </div>
            </header>

            {/* Sidebar de Lista */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}>
                <div className="sidebar-content" onClick={e => e.stopPropagation()}>
                    <div className="sidebar-header">
                        <h3>Tus Widgets</h3>
                        <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>×</button>
                    </div>
                    <div className="sidebar-list">
                        {widgets.map((w, index) => (
                            <div
                                key={w.id}
                                className={`sidebar-item ${index === activeIndex ? 'active' : ''} ${draggedItemIndex === index ? 'dragging' : ''}`}
                                onClick={() => { setActiveIndex(index); setIsSidebarOpen(false); }}
                                draggable="true"
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="item-main">
                                    <span className="drag-handle">⋮⋮</span>
                                    <span className="item-icon">{w.icon || '📺'}</span>
                                    <div className="item-details">
                                        <span className="item-name">{w.name}</span>
                                        {w.shortcut && <span className="item-shortcut-hint">[{w.shortcut.toUpperCase()}]</span>}
                                    </div>
                                </div>
                                <button className="item-delete" onClick={(e) => { e.stopPropagation(); removeWidget(w.id); }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        ))}
                        {widgets.length === 0 && <p className="empty-text">No hay widgets</p>}
                    </div>

                    <div className="sidebar-footer">
                        <div className="help-section">
                            <div className="help-header" onClick={() => setShowHelpLinks(!showHelpLinks)}>
                                <h4>Ayuda y Enlaces</h4>
                                <button className={`toggle-help ${showHelpLinks ? 'open' : ''}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                            </div>
                            {showHelpLinks && (
                                <>
                                    <p>Copia tus enlaces de widgets aquí:</p>
                                    <div className="help-links">
                                        <button onClick={() => openExternal('https://streamlabs.com/dashboard#/widgets/gallery')} className="help-link">
                                            <Logo name="streamlabs" />
                                            <span>Streamlabs</span>
                                        </button>
                                        <button onClick={() => openExternal('https://streamelements.com/dashboard/overlays')} className="help-link">
                                            <Logo name="streamelements" />
                                            <span>Elements</span>
                                        </button>
                                        <button onClick={() => openExternal('https://botrix.live/panel/widget')} className="help-link">
                                            <Logo name="botrix" />
                                            <span>Botrix</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <button className="clear-data-btn" onClick={() => { if (window.confirm('¿Borrar todos los widgets?')) { setWidgets([]); localStorage.removeItem('widgets'); } }}>
                            Borrar todos los datos
                        </button>
                    </div>
                </div>
            </div>

            <main className="viewer-main">
                {widgets.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        <p>Agrega un widget para comenzar</p>
                    </div>
                ) : (
                    <div className="widget-display-window">
                        <div className="window-header">
                            <button className="nav-arrow left" onClick={prevWidget}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <div className="window-info">
                                <span className="window-title">{activeWidget.name}</span>
                                <span className="window-counter">({activeIndex + 1}/{widgets.length})</span>
                            </div>
                            <div className="window-controls">
                                <input
                                    type="color"
                                    value={activeWidget.bgColor || '#000000'}
                                    onChange={(e) => setWidgets(widgets.map((w, i) => i === activeIndex ? { ...w, bgColor: e.target.value } : w))}
                                    className="color-picker-mini"
                                />
                                <button className="control-btn" onClick={() => setEditingWidget(activeWidget)} title="Editar">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button className="nav-arrow right" onClick={nextWidget}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                        <div className="iframe-container">
                            {widgets.map((widget, index) => (
                                <div
                                    key={widget.id}
                                    className={`iframe-wrapper ${index === activeIndex ? 'active' : 'hidden'}`}
                                    style={{ backgroundColor: widget.bgColor || '#000000' }}
                                >
                                    <iframe
                                        id={`iframe-${widget.id}`}
                                        src={widget.url}
                                        title={widget.name}
                                        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        referrerPolicy="no-referrer"
                                    ></iframe>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {(isModalOpen || editingWidget) && (
                <div className="modal-overlay" onClick={() => { setIsModalOpen(false); setEditingWidget(null); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingWidget ? 'Editar Widget' : 'Nuevo Widget'}</h2>
                        <form onSubmit={editingWidget ? updateWidget : addWidget}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    value={editingWidget ? editingWidget.name : newWidget.name}
                                    onChange={(e) => editingWidget ? setEditingWidget({ ...editingWidget, name: e.target.value }) : setNewWidget({ ...newWidget, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Enlace Streamlabs/Botrix</label>
                                <input
                                    type="url"
                                    value={editingWidget ? editingWidget.url : newWidget.url}
                                    onChange={(e) => editingWidget ? setEditingWidget({ ...editingWidget, url: e.target.value }) : setNewWidget({ ...newWidget, url: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tecla de acceso rápido (Atajo)</label>
                                    <input
                                        type="text"
                                        maxLength="1"
                                        placeholder="Ej: a, s, q..."
                                        value={editingWidget ? editingWidget.shortcut : newWidget.shortcut}
                                        onChange={(e) => editingWidget ? setEditingWidget({ ...editingWidget, shortcut: e.target.value }) : setNewWidget({ ...newWidget, shortcut: e.target.value })}
                                        className="shortcut-input"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Icono (Emoji)</label>
                                <div className="emoji-picker">
                                    {commonEmojis.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            className={`emoji-btn ${(editingWidget ? editingWidget.icon : newWidget.icon) === emoji ? 'selected' : ''}`}
                                            onClick={() => editingWidget ? setEditingWidget({ ...editingWidget, icon: emoji }) : setNewWidget({ ...newWidget, icon: emoji })}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group color-group">
                                    <label>Fondo</label>
                                    <input
                                        type="color"
                                        value={editingWidget ? editingWidget.bgColor : newWidget.bgColor}
                                        onChange={(e) => editingWidget ? setEditingWidget({ ...editingWidget, bgColor: e.target.value }) : setNewWidget({ ...newWidget, bgColor: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditingWidget(null); }}>Cancelar</button>
                                <button type="submit" className="save-btn">{editingWidget ? 'Guardar Cambios' : 'Agregar Widget'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

