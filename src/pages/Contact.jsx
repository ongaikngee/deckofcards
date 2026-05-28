import React from "react";

const Contact = () => {
  return (
    <div className="contact-page py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="card-title mb-3">Contact Me</h1>
              <p className="card-text mb-4">
                If you want to reach out, you can use any of the options below.
                I&apos;m happy to hear from you about games, feedback, or just
                to say hello.
              </p>

              <div className="row gy-3">
                <div className="col-md-6">
                  <div className="card border-light bg-light h-100">
                    <div className="card-body">
                      <h5 className="card-title">Address</h5>
                      <p className="card-text mb-0">1234 Deck Lane</p>
                      <p className="card-text mb-0">Suite 100</p>
                      <p className="card-text">Cardville, CA 90210</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-light bg-light h-100">
                    <div className="card-body">
                      <h5 className="card-title">Phone</h5>
                      <p className="card-text">
                        <a
                          href="tel:+1234567890"
                          className="text-decoration-none"
                        >
                          +1 (234) 567-8900
                        </a>
                      </p>
                      <h5 className="card-title mt-3">Email</h5>
                      <p className="card-text">
                        <a
                          href="mailto:hello@example.com"
                          className="text-decoration-none"
                        >
                          hello@example.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h5>Social Media</h5>
                <p className="mb-2">
                  Connect with me through any of these profiles:
                </p>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                  >
                    <span className="me-2 d-inline-flex align-items-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12Z" />
                      </svg>
                    </span>
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                  >
                    <span className="me-2 d-inline-flex align-items-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Zm-4.25 1.25a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
                      </svg>
                    </span>
                    Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                  >
                    <span className="me-2 d-inline-flex align-items-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M14.462 3.5h2.628c.218 1.303.933 2.444 1.917 3.243V12a4.5 4.5 0 1 1-4.5-4.5h.086V3.5Zm.814 10.5a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" />
                      </svg>
                    </span>
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
