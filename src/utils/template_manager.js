import Mustache from 'mustache';
import fs from 'fs';

export class TemplateManager {
	constructor(templatePath) {
		this.template = fs.readFileSync(templatePath, 'utf8');
	}

	addFunctionsToData(data) {
		return {
			...data,
			toUpperCase() {
				return function(text, render) {
					return render(text).toUpperCase();
				};
			},
			toLowerCase() {
				return function(text, render) {
					return render(text).toLowerCase();
				};
			}
		};
	}

	render(data) {
		let newData = this.addFunctionsToData(data);
		return Mustache.render(this.template, newData);
	}
}
