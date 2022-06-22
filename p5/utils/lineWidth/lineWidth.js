const mm_to_inch = mm => {
	const inches = mm / 25.4;
	return inches;
};

const utensils = {
	"Pilot G2 0.7": {
		defaultWidth: mm_to_inch(0.7), // reasonable data
		papers: {
			"Rhodia Web Note Book": {
				Speeds: {
					60: 0.7, // dummy data
					61: 0.5, // dummy data
				},
			},
		},
	},
};

const lineWidth = (utensil, paper, drawSpeed) => {
	return utensils[utensil].defaultWidth;
};
