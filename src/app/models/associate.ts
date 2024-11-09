import * as Model from '@/app/models';
import { I_ModelWithAssociate } from '@/shared/interfaces';

export class Associate {
	constructor() {
		const modelsKeys = Object.keys(Model) as Array<keyof typeof Model>;
		modelsKeys.forEach((key) => {
			const model = Model[key] as I_ModelWithAssociate;
			if (model.associate) {
				model.associate();
			}
		});
	}
}
