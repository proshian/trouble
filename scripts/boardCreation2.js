export function boardCreation() {
	//const slotArray = [];

	const field = document.querySelector('.field');
	const feildRect = field.getBoundingClientRect();
	const feildX = feildRect.x;
	const feildY = feildRect.y;

	const fragment = document.createDocumentFragment();



	// получить высоту родительского div'а (те поля)
	const halfFieldHeight = getHalfHeight(field);

	// чтобы получить высоту слота
	// создадим и удалим один элемент
	const slot = document.createElement('button');
	slot.classList.add('slot'); // ! возможно, лучше className
	field.appendChild(slot);

	const halfFieldSlotHeight = getHalfHeight(slot);

	field.removeChild(slot);


	const radius = 35;//halfFieldHeight - halfFieldSlotHeight;

	const finishRadius = halfFieldHeight + 2 * halfFieldSlotHeight;

	const slotsNum = 28; // число слотов

	const offset = 0;	// начальный угол для первогос слота



	for (let i = 0; i < slotsNum; i++) {
		// угол
		// отрицателен, чтобы слоты расположились "по часовой стрелке"
		const theta = 2 * Math.PI * i / slotsNum + offset;
		//const x = Math.round(radius * Math.cos(theta)) + feildX;
		//const y = Math.round(radius * Math.sin(theta)) - feildY;

		console.log(`i=${i}, thta = ${theta}`);

		const slot = createFieldSlot(
			i,
			radius + 'vmin',
			theta,
		);


		fragment.appendChild(slot);
		//slotArray.push(slot);
	}


	field.appendChild(fragment);
}


function getHalfHeight(element) {
	return Math.round(
		parseInt(
			window.getComputedStyle(element).height
		) / 2
	);
}

// number, string, string
function createFieldSlot(index, radius, theta) {
	const slot = document.createElement('button');
	slot.type = "button";
	slot.classList.add('feildSlot'); // ! возможно, лучше className
	slot.classList.add('slot');
	slot.dataset.index = index;	// добавляет атрибут data-index, i приводится к строке
	slot.style.transform = `rotate(${theta}rad) translate(${radius}) rotate(${ -theta }rad)`
	slot.innerText = index;
	return slot;
}