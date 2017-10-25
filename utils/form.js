function formParamsCollect(that, evt) {
	const name = evt.currentTarget.dataset.name;
	const value = evt.detail.value;
	let formData = that.data.formData;
	if (!formData) {
		formData = {};
	}
	formData[name] = value;
	that.setData({
		formData: formData
	});
	console.log(that.data.formData);
}

module.exports = {
	formParamsCollect:formParamsCollect
};