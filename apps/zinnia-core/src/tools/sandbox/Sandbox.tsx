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
      <div style={{ paddingBlockEnd: '0.5rem' }}>#p-cactions</div>
      <div id="p-cactions" />
    </div>
  );
}
