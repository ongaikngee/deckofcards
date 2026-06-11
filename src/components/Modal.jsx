import React from "react";

const Modal = ({
  modalID = "exampleModal",
  modalTitle = "Change",
  modalInstruction = "Modal body text goes here.",
  closeBtnLabel = "Close",
  okBtnLabel = "Ok",
  okBtnFunc = null,
}) => {
  return (
    <div
      className="modal fade"
      id={modalID}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {modalTitle}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{modalInstruction}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {closeBtnLabel}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => {
                // e.currentTarget.blur(); // Remove focus from the button after click
                // okBtnFunc();
                okBtnFunc?.();
              }}
            >
              {okBtnLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
