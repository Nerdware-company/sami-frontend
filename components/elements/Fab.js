import React from "react";

function Fab() {
  return (
    <div class="fab-container">
      <div class="floating-action-button fab-icon-holder">
        <i class="fas fa-question"></i>
      </div>
      <ul class="fab-options">
        <li>
          <a href="tel:+966551070050">
            <span class="fab-label">Phone</span>
            <div class="fab-icon-holder">
              <i class="fas fa-phone"></i>
            </div>
          </a>
        </li>
        <li>
          <a href="mailto:info@top1erp.com">
            <span class="fab-label">Email</span>
            <div class="fab-icon-holder">
              <i class="fas fa-envelope"></i>
            </div>
          </a>
        </li>
        <li>
          <a href="https://wa.me/966551070050" target="_blank">
            <span class="fab-label">WhatsApp</span>
            <div class="fab-icon-holder">
              <i class="fab fa-whatsapp"></i>
            </div>
          </a>
        </li>
        <li>
          <a href="https://twitter.com/Top1ERP" target="_blank">
            <span class="fab-label">Twitter</span>
            <div class="fab-icon-holder">
              <i class="fab fa-twitter"></i>
            </div>
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/channel/UCP6iojYf4eXoReZ6SVM5XFg"
            target="_blank"
          >
            <span class="fab-label">YouTube</span>
            <div class="fab-icon-holder">
              <i class="fab fa-youtube"></i>
            </div>
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/Top1ERP" target="_blank">
            <span class="fab-label">Facebook</span>
            <div class="fab-icon-holder">
              <i class="fab fa-facebook"></i>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Fab;
