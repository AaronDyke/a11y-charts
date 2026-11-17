// Turns the example data into the element properties that ChartExample assigns.
// Runs at build time in Node, so it must only import DOM-free modules.
import type { A11yBarChartConfig, A11yBarChartViewSection } from '@mzebley-aem/bar-chart';
import { chartGalleryExamples, type ChartGalleryExample } from './examples.js';
import { ageSection, availabilitySection, raceSection, targetSection } from './grouped-examples.js';

export interface DocsExample {
	/** Stable anchor for the example, kept from the original gallery. */
	id: string;
	type: 'line' | 'bar' | 'group';
	title: string;
	description: string;
	/** A suggestion for what to try with the example. */
	hint: string;
	properties: Record<string, unknown>;
}

const defined = (entries: Record<string, unknown>) =>
	Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== undefined));

function chartProperties(example: ChartGalleryExample): Record<string, unknown> {
	const shared = {
		chartTitle: example.title,
		context: example.context,
		dataNote: example.dataNote,
		suppressed: example.suppressed === true,
	};
	if (example.kind === 'line') {
		return defined({
			...shared,
			config: { showControls: false, ...example.config, valuePreset: example.valuePreset ?? 'number' },
			data: example.data,
			baseline: example.baseline,
			theme: example.theme,
			definitions: example.definitions,
		});
	}
	return defined({ ...shared, config: example.config, data: example.data, total: example.total, theme: example.theme });
}

/** A line or bar example by its id. */
export function chartExample(id: string): DocsExample {
	const example = chartGalleryExamples.find((candidate) => candidate.id === id);
	if (!example) throw new Error(`Unknown chart example "${id}".`);
	return {
		id: example.id,
		type: example.kind,
		title: example.title,
		description: example.description,
		hint: example.reviewHint,
		properties: chartProperties(example),
	};
}


const GROUP_HINT =
	'Change a population with the arrow keys, open Explain and Data, and download the CSV. The shared scale stays fixed while each percentage uses the selected total.';

function groupExample(
	id: string,
	title: string,
	description: string,
	sections: A11yBarChartViewSection[],
	scaleMaximum: number,
	overrides: A11yBarChartConfig = {},
): DocsExample {
	return {
		id,
		type: 'group',
		title,
		description,
		hint: GROUP_HINT,
		properties: {
			config: { headingLevel: 3, scaleMode: 'largest', scaleMaximum, showSummary: false, showDetails: true, ...overrides },
			theme: { color: '#244694' },
			groupMessages: { selectorLabel: `${title}: population selection` },
			sections,
		},
	};
}

export const groupExamples: Record<string, DocsExample> = {
	age: groupExample(
		'grouped-age',
		'Children by age range',
		'The All Ages view preserves values transcribed from a report screenshot. Individual age selections are illustrative and are identified in Data.',
		[ageSection()],
		365,
	),
	race: groupExample(
		'grouped-race',
		'Children by race/ethnicity',
		'All Race/Ethnicities and Black or African American reproduce visible report values. Other selections are illustrative.',
		[raceSection()],
		322,
	),
	sections: groupExample(
		'grouped-sections',
		'Multiple sections and availability states',
		'Switch sections, collapse their options, and compare suppressed, missing, and empty results. The chart keeps its reading preferences.',
		[ageSection(), raceSection(), availabilitySection()],
		365,
	),
	targets: groupExample(
		'grouped-targets',
		'Regional services and targets',
		'Compare minimum goals and inclusive target ranges. North includes an above-range result; South meets every goal, including exact boundaries. Color, texture, and text communicate outcomes.',
		[targetSection()],
		180,
		{ targetStyle: 'color-and-texture', positiveDirection: 'above' },
	),
};
