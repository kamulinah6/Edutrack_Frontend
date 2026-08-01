import React from 'react';
import { StudentRecord } from '../api';
import schoolLogo from '../assets/school-logo.jpg';

const SCHOOL_NAME = 'Weherabanda Muslim College';
const CARD_LABEL = 'STUDENT IDENTITY CARD';

const INK = '#132340';
const INK_SOFT = '#33455f';
const GOLD = '#b6904f';
const GOLD_SOFT = '#e4d3ad';
const TEAL = '#2f6f63';
const IVORY = '#faf6ec';
const CARD_BG = '#fffdf8';
const LABEL_COLOR = '#8a8471';
const LINE = '#e6dcc4';

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Cards are valid until the next 31 March (Sri Lankan academic-year cutover).
function validUntilDate() {
  const now = new Date();
  const year = now.getMonth() > 2 || (now.getMonth() === 2 && now.getDate() > 31) ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, 2, 31);
}

function validUntil() {
  return validUntilDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function academicYearRange() {
  const endYear = validUntilDate().getFullYear();
  return `${endYear - 1} \u2013 ${endYear}`;
}

function studentPhoto(s: StudentRecord) {
  if (s.photoUrl) return s.photoUrl;
  if (s.photoBase64) return `data:image/jpeg;base64,${s.photoBase64}`;
  return null;
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function schoolMonogram(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

const cornerMarkBase: React.CSSProperties = {
  position: 'absolute',
  width: 6,
  height: 6,
  borderColor: GOLD,
};

/**
 * The visual card itself, with no positioning opinions — sized to a
 * standard CR80 card (3.375in x 2.125in) and otherwise a normal flow
 * element. Reusable both for single-card printing and for laying many
 * cards out in a grid (see PrintableIdCardSheet).
 */
export function IdCardVisual({ student, decorated = true }: { student: StudentRecord; decorated?: boolean }) {
  const photo = studentPhoto(student);
  const dob = formatDate(student.dateOfBirth);

  return (
    <div
      style={{
        width: '3.375in',
        height: '2.125in',
        borderRadius: 16,
        overflow: 'hidden',
        fontFamily: "'Manrope', sans-serif",
        // Decorative gold/teal watermark background — only used for the
        // single "Print ID" card. It's disabled (plain flat background)
        // for the "Print All IDs" sheet, where it rendered inconsistently
        // across many cards on one print job.
        background: decorated
          ? 'radial-gradient(300px 220px at 85% 11%, rgba(228,201,138,0.5) 0%, rgba(228,201,138,0) 70%),' +
            'radial-gradient(340px 290px at 3% 83%, rgba(63,138,121,0.5) 0%, rgba(63,138,121,0) 70%),' +
            'radial-gradient(240px 150px at 88% -10%, #fdf9ef 0%, transparent 60%),' +
            'radial-gradient(210px 140px at -8% 108%, #f3ead1 0%, transparent 55%),' +
            'linear-gradient(155deg, #fbf7ec 0%, #f6efdd 55%, #f1e8d1 100%)'
          : CARD_BG,
        border: '1px solid #ddd3b4',
        boxShadow: '0 0 0 1px #E2EFF9',
      }}
    >
      {/* Decorative watermark / guilloché pattern — single-card print only */}
      {decorated && (
        <svg
          viewBox="0 0 324 204"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <text x="230" y="156" fontFamily="Fraunces, serif" fontWeight={600} fontSize={122} fill={INK} opacity={0.035} textAnchor="middle">
            {schoolMonogram(SCHOOL_NAME)}
          </text>
          <g stroke={GOLD} strokeWidth={0.6} fill="none" opacity={0.22}>
            <circle cx="324" cy="0" r="43" />
            <circle cx="324" cy="0" r="58" />
            <circle cx="324" cy="0" r="72" />
            <circle cx="324" cy="0" r="87" />
          </g>
          <g stroke={TEAL} strokeWidth={0.6} fill="none" opacity={0.16}>
            <circle cx="7" cy="204" r="50" />
            <circle cx="7" cy="204" r="65" />
            <circle cx="7" cy="204" r="80" />
          </g>
          <rect x="5" y="5" width="314" height="194" rx="10" fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.3} />
        </svg>
      )}

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '11px 14px 12px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${LINE}`, paddingBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 27, height: 27, borderRadius: '50%', flexShrink: 0,
              background: CARD_BG,
              boxShadow: `0 0 0 2px ${CARD_BG}, 0 0 0 3px ${GOLD_SOFT}`,
              overflow: 'hidden',
            }}>
              <img
                src={schoolLogo}
                alt={`${SCHOOL_NAME} crest`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 5, letterSpacing: '0.18em', color: GOLD, fontWeight: 600, marginBottom: 1 }}>
                {CARD_LABEL}
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 9.5, color: INK }}>
                {SCHOOL_NAME}
              </div>
            </div>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 4.8, letterSpacing: '0.16em', color: INK_SOFT, textAlign: 'right' }}>
            ACADEMIC YEAR
            <div style={{ color: INK, fontSize: 5.8, letterSpacing: '0.08em', marginTop: 1, fontWeight: 700 }}>
              {academicYearRange()}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, paddingTop: 5 }}>
          {/* Portrait */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              position: 'relative', width: 48, height: 60, borderRadius: 6,
              background: `linear-gradient(150deg, ${INK} 0%, ${TEAL} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: IVORY, fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 17,
              boxShadow: '0 4px 8px -4px rgba(19,35,64,0.4)', overflow: 'hidden',
            }}>
              {photo ? (
                <img src={photo} alt={student.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : initials(student.fullName)}
              <span style={{ ...cornerMarkBase, top: -2, left: -2, borderTop: '1px solid', borderLeft: '1px solid' }} />
              <span style={{ ...cornerMarkBase, top: -2, right: -2, borderTop: '1px solid', borderRight: '1px solid' }} />
              <span style={{ ...cornerMarkBase, bottom: -2, left: -2, borderBottom: '1px solid', borderLeft: '1px solid' }} />
              <span style={{ ...cornerMarkBase, bottom: -2, right: -2, borderBottom: '1px solid', borderRight: '1px solid' }} />
            </div>
            <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: 3.6, letterSpacing: '0.14em', color: LABEL_COLOR, textTransform: 'uppercase', marginTop: 3 }}>
              Photo ID
            </div>
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 11.5, color: INK, marginBottom: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {student.fullName}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 6, fontWeight: 700, color: INK, letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>
              Grade {student.grade}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 4, columnGap: 8 }}>
              <div>
                <div style={{ fontSize: 4.4, letterSpacing: '0.1em', textTransform: 'uppercase', color: LABEL_COLOR, fontWeight: 700, marginBottom: 1 }}>Student ID</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 6, color: INK, fontWeight: 500 }}>{student.studentId}</div>
              </div>
              {student.registrationNumber && (
                <div>
                  <div style={{ fontSize: 4.4, letterSpacing: '0.1em', textTransform: 'uppercase', color: LABEL_COLOR, fontWeight: 700, marginBottom: 1 }}>Reg. No.</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 6, color: INK, fontWeight: 500 }}>{student.registrationNumber}</div>
                </div>
              )}
              {dob && (
                <div>
                  <div style={{ fontSize: 4.4, letterSpacing: '0.1em', textTransform: 'uppercase', color: LABEL_COLOR, fontWeight: 700, marginBottom: 1 }}>Date of Birth</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 6, color: INK, fontWeight: 500 }}>{dob}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 4.4, letterSpacing: '0.1em', textTransform: 'uppercase', color: LABEL_COLOR, fontWeight: 700, marginBottom: 1 }}>Valid Until</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 6, color: INK, fontWeight: 500 }}>{validUntil()}</div>
              </div>
            </div>
          </div>

          {/* QR */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{
              width: 58, height: 58, background: CARD_BG, border: `1px solid ${LINE}`,
              borderRadius: 6, padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {student.qrImageBase64 ? (
                <img
                  src={`data:image/png;base64,${student.qrImageBase64}`}
                  alt="QR"
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%', background: '#FDF3F0', borderRadius: 3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 3.6, color: '#B54708', fontWeight: 600, letterSpacing: '0.02em',
                  padding: 2, lineHeight: 1.3,
                }}>
                  No QR — regenerate
                </div>
              )}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 4.4, letterSpacing: '0.1em', color: LABEL_COLOR, textTransform: 'uppercase', textAlign: 'center' }}>
              Scan to Verify
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Default export — used by the single "🖨 Print ID" button. Keeps the
 * original off-screen fixed positioning + #print-id-card id so the existing
 * single-card print CSS in Students.tsx keeps working unchanged.
 */
export default function PrintableIdCard({ student }: { student: StudentRecord }) {
  return (
    <div id="print-id-card" style={{ position: 'fixed', top: -10000, left: -10000 }}>
      <IdCardVisual student={student} />
    </div>
  );
}
