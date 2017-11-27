<script>
import SkyList from 'SkyList';
import SkySearchMixin from 'SkySearch/SkySearch.mixin';

const preferences = {
	api: '/umbraco/api/SiteSearchApi/Search',
	pagination: true,
	fetchConditions: {
		keywords(keywords) {
			return keywords.length;
		},
	},
};

const parameters = {
	keywords: '',
};

export default {
	mixins: [SkySearchMixin],
	props: ['overlay'],
	data() {
		return {
			list: null,
			parameters,
		};
	},
	beforeMount() {
		this.list = new SkyList(preferences, parameters);
		/**
		 * Populate keywords from list in case it has intial value
		 * (from url string for instance)
		 */
		Object.keys(this.parameters).forEach((key) => {
			if (key in this.list.params) {
				this.parameters[key] = this.list.params[key];
			}
		});
	},
	watch: {
		parameters: {
			handler() {
				// Keep list params in sync
				Object.keys(this.parameters).forEach((key) => {
					if (this.list.params[key] !== this.parameters[key]) {
						this.list.params[key] = this.parameters[key];
						// Reset offset if params have changed
						this.list.params.offset = 0;
					}
				});
				this.update();
			},
			deep: true,
		},
	},
	methods: {
		update() {
			// Only update if keywords length is above 1
			if (this.parameters.keywords.length > 1) {
				this.list.update();
			} else {
				this.list.reset();
			}
		},
	},
};
</script>

<style src="./SkySearch.scss" scoped></style>
<template src="./SkySearch.html"></template>
