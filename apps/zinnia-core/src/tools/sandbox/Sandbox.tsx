export function Sandbox() {
  return (
    <div
      id="zinnia-sandbox"
      style={{
        display: process.env.NODE_ENV === 'development' ? 'flex' : 'none',
        flexDirection: 'column',
        maxWidth: 500,
        margin: 'auto',
        marginTop: '5rem',
        padding: '1rem',
        border: '2px solid #696969',
        color: '#ced4da',
        mixBlendMode: 'difference',
      }}
    >
      <div style={{ paddingBlockEnd: '0.5rem', fontWeight: 600 }}>
        Zinnia Sandbox DOM (for development)
      </div>
      <div style={{ paddingBlock: '0.5rem' }}>#zsb-p-cactions</div>
      <div id="zsb-p-cactions" />
      <div style={{ paddingBlock: '0.5rem' }}>#zsb-p-personal</div>
      <div id="zsb-p-personal" />
      <div style={{ paddingBlock: '0.5rem' }}>#zsb-p-tb</div>
      <div id="zsb-p-tb" />
    </div>
  );
}
