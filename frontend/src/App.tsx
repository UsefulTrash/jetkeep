import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

const CONTRACT = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;

export default function App() {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [val, setVal] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui', padding: '2rem' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ background: '#ea580c', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>JetKeep</h1>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>USDC Custody — Lock for beneficiary</p>
        </div>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><ConnectButton /></div>
        {isConnected && (
          <div style={{ background: '#1e293b', borderRadius: 12, padding: '1.5rem' }}>
            <input value={val} onChange={e => setVal(e.target.value)} placeholder="Amount (USDC)"
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: 'none', background: '#334155', color: '#f1f5f9', marginBottom: '1rem', boxSizing: 'border-box' }} />
            <button disabled={isPending || !val} onClick={() => writeContract({ address: CONTRACT, abi: [{name:'createLock',type:'function',stateMutability:'payable',inputs:[{name:'beneficiary',type:'address'},{name:'releaseAt',type:'uint256'},{name:'note',type:'string'}],outputs:[{type:'uint256'}]}] as const, functionName: 'createLock', args: ['0x0000000000000000000000000000000000000001', BigInt(Math.floor(Date.now()/1000)+86400),'Lock note'], value: parseEther(val||'0') })} style={{ width:'100%',padding:'0.7rem',borderRadius:8,border:'none',background:'#ea580c',color:'#fff',fontWeight:600,cursor:'pointer' }}>{isPending ? 'Locking…' : 'Create Lock'}</button>
          </div>
        )}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#475569', marginTop: '1.5rem' }}>Robinhood Testnet · USDC Native · <a href={`https://explorer.testnet.chain.robinhood.com/address/${CONTRACT}`} style={{ color: '#ea580c' }} target="_blank">Contract ↗</a></p>
      </div>
    </div>
  );
}