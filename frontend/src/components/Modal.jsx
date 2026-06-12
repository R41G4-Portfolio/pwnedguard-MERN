const Modal = ({ isOpen, onClose, title, message, onConfirm, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
	if (!isOpen) return null;

	return (
		<div className="modal modal--open" onClick={onClose}>
			<div className="modal__container" onClick={(e) => e.stopPropagation()}>
				<button className="modal__close" onClick={onClose}>✕</button>
				{title && <h3 className="modal__title">{title}</h3>}
				<div className="modal__content">
					<p className="modal__message">{message}</p>
					<div className="modal__actions flex gap-2 justify-center mt-4">
						<button className="btn btn--secondary" onClick={onClose}>
							{cancelText}
						</button>
						<button className="btn btn--danger" onClick={onConfirm}>
							{confirmText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;