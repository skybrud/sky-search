export default {
	computed: {
		messageStatus() {
			if (this.list) {
				const resultText = this.list.results.pagination.total === 1
					? 'result'
					: 'results';

				if (this.list.untouched) {
					return '';
				} else if (this.list.loading) {
					return 'Fetching results...';
				}

				return `Your search returned <strong>${this.list.results.pagination.total} ${resultText}</strong>`;
			}

			return '';
		},
		messageNext() {
			if (this.list) {
				if (this.list.preferences.pagination) {
					return 'Next page';
				}

				return `Load more (a total of ${this.list.results.pagination.total})`;
			}

			return '';
		},
		messagePrevious() {
			if (this.list && this.list.preferences.pagination) {
				return 'Previous page';
			}
			return false;
		},
	},
	methods: {
		update() {
			this.list.update();
		},
		reset() {
			this.list.reset();
		},
		previous() {
			this.list.previous();
		},
		next() {
			this.list.next();
		},
	},
};
