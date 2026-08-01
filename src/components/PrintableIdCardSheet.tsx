import React from 'react';
import { StudentRecord } from '../api';
import { IdCardVisual } from './PrintableIdCard';

// 2 columns x 3 rows = 6 cards per A4 page.
// NOTE: this used to be 8 (2 cols x 4 rows), but 4 rows of cards + gaps +
// print margins was too tall to reliably fit one A4 page. When the grid
// silently overflowed, the browser auto-split it across a second physical
// page mid-grid — and cards that got flowed onto that second page lost
// their SVG watermark gradient (a Chromium print-pagination rendering bug
// where <defs>/gradients don't reliably carry over for content fragmented
// onto a new page). Dropping to 6 per page keeps every card safely within
// a single physical page, so no card ever gets auto-split like that.
const CARDS_PER_PAGE = 6;
const COLUMNS = 2;

/**
 * Renders every given student's ID card as a set of A4 "sheets" — 6 cards
 * per page, laid out 2 columns x 3 rows, with a dashed cut-guide border
 * around each card so the printed page can be cut apart cleanly.
 *
 * Meant to be rendered off-screen and revealed only for @media print (see
 * the print CSS wired up in Students.tsx), then printed via window.print().
 * Choosing "Save as PDF" as the destination in the print dialog produces an
 * actual multi-page A4 PDF.
 */
export default function PrintableIdCardSheet({ students }: { students: StudentRecord[] }) {
  const pages: StudentRecord[][] = [];
  for (let i = 0; i < students.length; i += CARDS_PER_PAGE) {
    pages.push(students.slice(i, i + CARDS_PER_PAGE));
  }

  return (
    <div id="print-id-sheet">
      {pages.map((pageStudents, pageIndex) => (
        <div
          key={pageIndex}
          className="id-sheet-page"
          style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${COLUMNS}, 3.375in)`,
            gridAutoRows: '2.125in',
            justifyContent: 'center',
            alignContent: 'center',
            gap: '6mm',
            pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto',
            breakAfter: pageIndex < pages.length - 1 ? 'page' : 'auto',
          }}
        >
          {pageStudents.map(s => (
            <div
              key={s.id}
              style={{
                outline: '1px dashed #999',
                outlineOffset: '4px',
                breakInside: 'avoid',
              }}
            >
              <IdCardVisual student={s} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
