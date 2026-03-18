import { createRowsFromLegacyDefs } from '../factory.js';

import { createCharacteristicsSection } from './characteristics-section.js';
import { createEnemySection } from './enemy-section.js';
import { createFameSection } from './fame-section.js';
import { createPlayerSection } from './player-section.js';
import { createSchoolSection } from './school-section.js';
import { createStatsSection } from './stats-section.js';
import { createTalentSection } from './talent-section.js';

export function createStatMetadata(context) {
  const separators = [
    { ids: [''], inputs: ['header'], values: ['Stats'] },
    { ids: [''], inputs: ['newline'], values: [''] },
    { ids: [''], inputs: ['header'], values: ['Enemy stats'] },
    { ids: [''], inputs: ['newline'], values: [''] },
    { ids: [''], inputs: ['header'], values: ['Player'] },
    { ids: [''], inputs: ['newline'], values: [''] },
    { ids: [''], inputs: ['header'], values: ['Characteristics'] },
    { ids: [''], inputs: ['newline'], values: [''] },
    { ids: [''], inputs: ['header'], values: ['Fame'] },
    { ids: [''], inputs: ['newline'], values: [''] },
    { ids: [''], inputs: ['header'], values: ['School'] },
    { ids: [''], inputs: ['newline'], values: [''] },
    { ids: [''], inputs: ['header'], values: ['Talent'] },
  ];

  const sepRows = createRowsFromLegacyDefs(separators);
  const sections = [
    createStatsSection(),
    createEnemySection(),
    createPlayerSection(context),
    createCharacteristicsSection(context),
    createFameSection(context),
    createSchoolSection(context),
    createTalentSection(context),
  ];
  const byHeader = new Map(sections.map((section) => [section.afterHeader, section.rows]));

  const rows = [];
  sepRows.forEach((row) => {
    rows.push(row);
    const header = row.children?.find((c) => c.type === 'header');
    if (!header?.label) return;
    const sectionRows = byHeader.get(header.label);
    if (sectionRows) rows.push(...sectionRows);
  });

  return rows;
}
