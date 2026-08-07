import React from 'react';
import {
  X, Package, Truck, Home, MapPin, Clock, CheckCircle, Radio
} from 'lucide-react';
import { useApp } from '../context';

const STEPS = [
  { key: 'Order Placed',       Icon: CheckCircle, color: '#10b981' },
  { key: 'Processing',         Icon: Package,     color: '#f59e0b' },
  { key: 'Shipped',            Icon: Truck,       color: '#38bdf8' },
  { key: 'Out for Delivery',   Icon: MapPin,      color: '#c084fc' },
  { key: 'Delivered',          Icon: Home,        color: '#10b981' },
];

// Map order status to step index
const statusToStep = {
  'Processing':       1,
  'Shipped':          2,
  'Out for Delivery': 3,
  'Delivered':        4,
};

function getActivityLog(order, stepIndex) {
  const base = new Date(order.date);
  const log = [];

  const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
  const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  log.push({ time: fmt(base), text: 'Order confirmed and payment received.' });
  if (stepIndex >= 1) log.push({ time: fmt(addDays(base, 0)), text: `Order being prepared by ${order.seller || 'Seller'}.` });
  if (stepIndex >= 2) log.push({ time: fmt(addDays(base, 1)), text: `Picked up by ${order.carrier || 'Delhivery'}. AWB: ${order.awb || 'AWB-90823411'}` });
  if (stepIndex >= 2) log.push({ time: fmt(addDays(base, 1)), text: 'Arrived at Mumbai Sorting Facility.' });
  if (stepIndex >= 3) log.push({ time: fmt(addDays(base, 3)), text: 'Out for delivery — delivery partner on the way.' });
  if (stepIndex >= 4) log.push({ time: fmt(addDays(base, 4)), text: '📦 Delivered successfully. Enjoy your book!' });

  return log.reverse();
}

export default function TrackShipmentModal() {
  const { trackOrder, setTrackOrder } = useApp();

  if (!trackOrder) return null;

  const currentStep = statusToStep[trackOrder.status] ?? 0;
  const estimatedDelivery = new Date(new Date(trackOrder.date).getTime() + 5 * 86400000)
    .toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
  const activityLog = getActivityLog(trackOrder, currentStep);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9500,
        background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        pointerEvents: 'auto'
      }}
      onClick={() => setTrackOrder(null)}
    >
      <div
        style={{
          background: 'rgba(16,22,40,0.99)', border: '1px solid rgba(108,99,255,0.25)',
          borderRadius: 22, width: '100%', maxWidth: 560,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(108,99,255,0.08)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem', flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(108,99,255,0.08))',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
        }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' }}>
              Track Shipment
            </h2>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              Order <span style={{ color: '#c084fc', fontWeight: 700 }}>{trackOrder.id}</span>
              {trackOrder.carrier && (
                <> &nbsp;·&nbsp; <span style={{ color: '#38bdf8' }}>{trackOrder.carrier}</span></>
              )}
            </div>
            {trackOrder.awb && (
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.15rem' }}>
                AWB: <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{trackOrder.awb}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setTrackOrder(null)}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.07)', color: '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '1.5rem' }}>

          {/* ETA Banner */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 14, padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'
          }}>
            <div style={{ padding: '0.6rem', background: 'rgba(245,158,11,0.1)', borderRadius: '50%', flexShrink: 0 }}>
              <Clock size={20} color="#f59e0b" />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expected Delivery</div>
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.05rem' }}>{estimatedDelivery}</div>
            </div>
          </div>

          {/* 5-Step visual timeline */}
          <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
            {/* Background track */}
            <div style={{
              position: 'absolute', left: 22, top: 22, bottom: 22, width: 2,
              background: 'rgba(255,255,255,0.08)', zIndex: 0
            }} />
            {/* Progress fill */}
            <div style={{
              position: 'absolute', left: 22, top: 22, width: 2, zIndex: 0,
              height: `${(currentStep / (STEPS.length - 1)) * 100}%`,
              background: 'linear-gradient(to bottom, #10b981, #6c63ff)',
              maxHeight: 'calc(100% - 44px)',
              transition: 'height 0.6s ease'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {STEPS.map((step, idx) => {
                const done = idx <= currentStep;
                const active = idx === currentStep;
                return (
                  <div key={step.key} style={{ display: 'flex', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                    {/* Icon bubble */}
                    <div style={{
                      width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                      background: done ? `rgba(${step.color === '#10b981' ? '16,185,129' : step.color === '#f59e0b' ? '245,158,11' : step.color === '#38bdf8' ? '56,189,248' : step.color === '#c084fc' ? '192,132,252' : '16,185,129'},0.15)` : 'rgba(255,255,255,0.04)',
                      border: `2px solid ${done ? step.color : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: active ? `0 0 0 5px ${step.color}22, 0 0 20px ${step.color}44` : 'none',
                      transition: 'all 0.4s'
                    }}>
                      <step.Icon size={20} color={done ? step.color : '#475569'} />
                    </div>

                    {/* Label */}
                    <div style={{ paddingTop: '0.55rem' }}>
                      <div style={{
                        fontWeight: done ? 700 : 500,
                        color: done ? '#f1f5f9' : '#475569',
                        fontSize: '1rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                      }}>
                        {step.key}
                        {active && (
                          <span style={{
                            fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                            borderRadius: 999, background: `${step.color}22`, color: step.color,
                            border: `1px solid ${step.color}44`, textTransform: 'uppercase', letterSpacing: '0.07em'
                          }}>Live</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <h4 style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Tracking Activity
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activityLog.map((entry, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                  padding: '0.85rem', borderRadius: 12,
                  background: i === 0 ? 'rgba(108,99,255,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${i === 0 ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.05)'}`
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                    background: i === 0 ? '#6c63ff' : '#334155',
                    boxShadow: i === 0 ? '0 0 8px #6c63ff' : 'none'
                  }} />
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.2rem' }}>{entry.time}</div>
                    <div style={{ color: i === 0 ? '#f1f5f9' : '#94a3b8', fontSize: '0.88rem', lineHeight: 1.4 }}>{entry.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
