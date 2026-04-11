'use client';
export default function Home() {
  return (
    <div style={{background:'#050505',minHeight:'100vh',color:'white',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'20px'}}>
      <h1 style={{color:'#D4AF37',fontSize:'3rem',fontWeight:700}}>
        YourTVSat VIP
      </h1>
      <p style={{color:'rgba(255,255,255,0.6)',fontSize:'1.2rem'}}>
        Plateforme Premium IPTV
      </p>
      <button style={{background:'linear-gradient(135deg,#D4AF37,#FF8C00)',color:'#000',border:'none',padding:'15px 40px',borderRadius:'50px',fontWeight:700,fontSize:'1rem',cursor:'pointer'}}>
        Test 24H Gratuit
      </button>
    </div>
  );
}
