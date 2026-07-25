import React from 'react';
import { StudentRecord } from '../api';
import { IdCardVisual } from './PrintableIdCard';

const CARDS_PER_PAGE = 8; // 2 columns x 4 rows
const COLUMNS = 2;

/**
 * Renders every given student's ID card as a set of A4 "sheets" — 8 cards
 * per page, laid out 2 columns x 4 rows, with a dashed cut-guide border
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
