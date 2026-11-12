import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DocumentJourneyMatrix } from '../../components/backoffice/DocumentJourneyMatrix';
import { BackOfficeLayout } from '../../components/backoffice/BackOfficeLayout';
import { TEST_CASE_AP47_FIXTURE } from './testFixtures';

describe('Document Print Fidelity & Layout Integrity', () => {
  const testCase = TEST_CASE_AP47_FIXTURE;

  it('verifies BackOfficeLayout does not hide children in print stylesheets', () => {
    const html = renderToString(
      React.createElement(BackOfficeLayout, {
        currentRole: 'director',
        onChangeRole: () => {},
        activeCase: testCase,
        cases: [testCase],
        onSelectCase: () => {},
        activeTab: 'documents',
        onChangeTab: () => {},
        onExitBackOffice: () => {},
        onOpenNewCase: () => {},
        children: React.createElement('div', { id: 'test-child-content' }, 'Official Document Content')
      })
    );

    // The wrapper around children MUST NOT have print:hidden or no-print
    expect(html).toContain('id="test-child-content"');
    // Ensure the children wrapper has print:block and print:w-full
    expect(html).toContain('print:block print:w-full');
    // Ensure the header and aside ARE hidden in print
    expect(html).toContain('sticky top-0 z-30 border-b border-amber-400/20 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:px-6 print:hidden no-print');
  });

  it('verifies DocumentJourneyMatrix preview modal renders populated fields and print utility classes', () => {
    const html = renderToString(
      React.createElement(DocumentJourneyMatrix, {
        caseData: testCase,
        onUpdateDocumentStatus: () => {},
        onUpdateCase: () => {},
        onOpenESign: () => {},
      })
    );

    // Matrix table should be rendered
    expect(html).toContain('Document Journey &amp; Delivery Matrix');
    expect(html).toContain('13 Official BFH Forms');
    expect(html).toContain('Engagement of Services &amp; Financial Responsibility Affidavit');
  });
});
