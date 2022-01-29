export function boardCreation() {
	//const slotArray = [];

	const field = document.querySelector('.field');
	const feildRect = field.getBoundingClientRect();
	const feildX = feildRect.x;
	const feildY = feildRect.y;

	const fragment = document.createDocumentFragment();



	// �������� ������ ������������� div'� (�� ����)
	const halfFieldHeight = getHalfHeight(field);

	// ����� �������� ������ �����
	// �������� � ������ ���� �������
	const slot = document.createElement('button');
	slot.classList.add('slot'); // ! ��������, ����� className
	field.appendChild(slot);

	const halfFieldSlotHeight = getHalfHeight(slot);

	field.removeChild(slot);


	const radius = 35;//halfFieldHeight - halfFieldSlotHeight;

	const finishRadius = halfFieldHeight + 2 * halfFieldSlotHeight;

	const slotsNum = 28; // ����� ������

	const offset = 0;	// ��������� ���� ��� �������� �����



	for (let i = 0; i < slotsNum; i++) {
		// ����
		// �����������, ����� ����� ������������� "�� ������� �������"
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
	slot.classList.add('feildSlot'); // ! ��������, ����� className
	slot.classList.add('slot');
	slot.dataset.index = index;	// ��������� ������� data-index, i ���������� � ������
	slot.style.transform = `rotate(${theta}rad) translate(${radius}) rotate(${ -theta }rad)`
	slot.innerText = index;
	return slot;
}