import type { A11yBarChartConfig, A11yBarChartGroupElement, A11yBarChartViewSection } from '@mzebley-aem/bar-chart';

/** Live settings for a grouped bar chart example: scale, data view, and an external report filter. */
export function mountGroupSettings(
	container: HTMLElement,
	group: A11yBarChartGroupElement,
	original: { config: A11yBarChartConfig; sections: A11yBarChartViewSection[] },
	changed: () => void,
): { reset(): void } {
	const maximum = original.config.scaleMaximum;
	const grid = document.createElement('div');
	grid.className = 'settings-grid';
	const fieldset = document.createElement('fieldset');
	fieldset.className = 'example-setting-group';
	fieldset.append(Object.assign(document.createElement('legend'), { textContent: 'Grouped chart' }));
	grid.append(fieldset);

	function select(labelText: string, choices: [string, string][], onChange: (value: string) => void): HTMLSelectElement {
		const label = document.createElement('label');
		label.className = 'example-setting';
		label.append(document.createTextNode(`${labelText} `));
		const input = document.createElement('select');
		for (const [value, caption] of choices) input.append(Object.assign(document.createElement('option'), { value, textContent: caption }));
		input.addEventListener('change', () => {
			onChange(input.value);
			changed();
		});
		label.append(input);
		fieldset.append(label);
		return input;
	}

	const scale = select(
		'Bar scale',
		[['shared', 'Shared count scale'], ['largest', 'Rescale for each selection'], ['population', 'Share of selected population']],
		(value) => {
			group.config = {
				...group.config,
				scaleMode: value === 'population' ? 'population-share' : 'largest',
				scaleMaximum: value === 'shared' ? maximum : undefined,
			};
		},
	);
	const dataView = select('Complete data view', [['dialog', 'Dialog'], ['inline', 'Inline']], (value) => {
		group.config = { ...group.config, dataView: value as 'dialog' | 'inline' };
	});
	const filter = select('External report filter', [['off', 'Off'], ['on', 'On (remains active when selecting All)']], (value) => {
		group.sections = original.sections.map((section) => ({
			...section,
			views: section.views.map((view) => ({ ...view, filtered: value === 'on' || view.filtered })),
		}));
	});
	container.append(grid);

	return {
		reset() {
			group.sections = original.sections;
			group.selectedSectionId = original.sections[0]!.id;
			group.selectedViewId = original.sections[0]!.allViewId;
			group.config = { dataView: 'dialog', explanationExpanded: false, glossaryExpanded: false, ...original.config };
			scale.value = 'shared';
			dataView.value = 'dialog';
			filter.value = 'off';
		},
	};
}
