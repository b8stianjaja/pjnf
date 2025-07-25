import React, { useState, useEffect, useMemo } from 'react';

// --- Reusable Hook defined directly in this file ---
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

// --- Icon Components ---
const ModelIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 7l10 4 10-4-10-4z"></path><path d="M2 17l10 4 10-4"></path><path d="M2 12l10 4 10-4"></path></svg>);
const ImageIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const FileIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>);
const UploadIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>);
const BackIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);

// --- Child Components ---
const FileItem = ({ file, isSelected, onSelect }) => {
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const handleDownload = (e) => {
        e.stopPropagation();
        if (isDownloading) return;
        setIsDownloading(true);
        const interval = setInterval(() => setDownloadProgress(p => p >= 100 ? (clearInterval(interval), setIsDownloading(false), 100) : p + 2), 50);
    };
    const getFileIcon = (type) => ({ model: <ModelIcon />, image: <ImageIcon /> }[type] || <FileIcon />);
    return (
        <div className={`file-item ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
            <div className="file-icon-container">{getFileIcon(file.type)}</div>
            <div className="file-details"><span className="file-name">{file.name}</span><span className="file-meta">{file.size} MB</span></div>
            <div className="file-action">{isDownloading ? <div className="download-progress-container"><div className="download-progress-bar" style={{ width: `${downloadProgress}%` }}></div><span>{downloadProgress}%</span></div> : <button onClick={handleDownload}>Download</button>}</div>
        </div>
    );
};

const FilesPanel = ({ onFileUpload }) => {
    const initialFiles = useMemo(() => [
        { name: 'worldT1.glb', type: 'model', size: 12.8, date: '2025-07-22' },
        { name: 'hdr.hdr', type: 'image', size: 5.1, date: '2025-07-21' },
        { name: 'character0.glb', type: 'model', size: 8.4, date: '2025-07-20' },
        { name: 'texture_map.png', type: 'image', size: 2.3, date: '2025-07-19' },
    ], []);

    const isMobile = useMediaQuery('(max-width: 768px)');
    const [selectedFile, setSelectedFile] = useState(isMobile ? null : initialFiles[0]);

    const [files, setFiles] = useState(initialFiles);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (isMobile) {
            setSelectedFile(null);
        } else {
            const currentSelectionExists = files.some(f => f.name === selectedFile?.name);
            if (!currentSelectionExists && files.length > 0) {
                setSelectedFile(files[0]);
            } else if (!selectedFile && files.length > 0) {
                setSelectedFile(files[0]);
            }
        }
    }, [isMobile, files, selectedFile]);

    useEffect(() => {
        if (filter === 'all') {
            setFiles(initialFiles);
        } else {
            setFiles(initialFiles.filter(f => f.type === filter));
        }
    }, [filter, initialFiles]);

    const totalSize = useMemo(() => initialFiles.reduce((acc, f) => acc + f.size, 0).toFixed(1), [initialFiles]);
    const storagePercent = useMemo(() => (totalSize / 5000) * 100, [totalSize]);

    const FileListView = (
        <div className="files-left-column">
            <div className="content-header"><h1>File Transfers</h1></div>
            <div className="storage-overview"><div className="storage-bar"><div className="storage-used" style={{width: `${storagePercent}%`}}></div></div><div className="storage-text"><span>{totalSize} MB of 5 GB Used</span></div></div>
            <div className="file-controls">
                <div className="file-filters">
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                    <button className={filter === 'model' ? 'active' : ''} onClick={() => setFilter('model')}>Models</button>
                    <button className={filter === 'image' ? 'active' : ''} onClick={() => setFilter('image')}>Images</button>
                </div>
            </div>
            <div className="file-list">{files.map((file, i) => <FileItem key={i} file={file} isSelected={selectedFile?.name === file.name} onSelect={() => setSelectedFile(file)} />)}</div>
        </div>
    );

    const FileDetailView = (
        <div className="file-details-panel">
            {isMobile && (
                <div className="details-header-mobile">
                    <button className="back-button" onClick={() => setSelectedFile(null)}><BackIcon /> All Files</button>
                </div>
            )}
            { selectedFile && <>
                <div className="details-preview-icon">{selectedFile.type === 'model' ? <ModelIcon /> : <ImageIcon />}</div>
                <h2>{selectedFile.name}</h2>
                <div className="details-meta-grid">
                    <div className="meta-item"><span>Size</span><p>{selectedFile.size} MB</p></div>
                    <div className="meta-item"><span>Type</span><p>{selectedFile.type}</p></div>
                    <div className="meta-item"><span>Modified</span><p>{selectedFile.date}</p></div>
                </div>
                <button className="share-button" onClick={() => alert('Sharing options coming soon!')}>Share File</button>
            </> }
        </div>
    );

    return (
        <div className="content-panel active" id="files-panel">
            <div className="files-main-area">
                {isMobile ? (
                    selectedFile ? FileDetailView : FileListView
                ) : (
                    <>
                        {FileListView}
                        {FileDetailView}
                    </>
                )}
            </div>
             <div className="upload-area">
                <div className="dropzone">
                    <UploadIcon/>
                    <p>Drag & Drop files here or <span>Browse Files</span></p>
                    <input type="file" onChange={onFileUpload} />
                </div>
            </div>
        </div>
    );
};

export default FilesPanel;