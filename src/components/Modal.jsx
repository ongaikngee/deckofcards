import React from "react";

const Modal = ({
  modalID = "exampleModal",
  modalTitle = "Change",
  modalInstruction = "Modal body text goes here.",
  closeBtnLabel = "Close",
  okBtnLabel = "Ok",
  okBtnFunc = null,
  okBtnClass = "btn-primary",
  closeBtnClass = "btn-secondary",
}) => {
  return (
    <div
      className="modal fade"
      id={modalID}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      onClick={(e) => {
        e.currentTarget.blur()
      }}
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
              onClick={(e) => {
                e.currentTarget.blur()
              }}
            ></button>
          </div>
          <div className="modal-body">{modalInstruction}</div>
          <div className="modal-footer">
            <button
              type="button"
              className={`btn ${closeBtnClass}`}
              data-bs-dismiss="modal"
              onClick={(e) => {
                e.currentTarget.blur()
              }}
            >
              {closeBtnLabel}
            </button>
            <button
              type="button"
              className={`btn ${okBtnClass}`}
              data-bs-dismiss="modal"
              onClick={() => okBtnFunc?.()}
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
