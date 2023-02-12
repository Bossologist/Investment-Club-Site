import wixLocation from 'wix-location';

$w.onReady(function () {

});

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function joinTeam(event) {
	wixLocation.to("/blank-1");
}

export function createTeam(event) {
	wixLocation.to("/blank");
}
