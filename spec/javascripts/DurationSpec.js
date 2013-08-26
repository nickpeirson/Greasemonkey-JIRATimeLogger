describe("Duration", function() {
	it("will allow numerical strings to be converted to hours, minutes and seconds", function() {
		expect("123456".toHHMMSS()).toEqual("34h 17m 36s");
	});
	
	it("will allow numbers to be converted to hours, minutes and seconds", function() {
		expect((123456).toHHMMSS()).toEqual("34h 17m 36s");
	});
});