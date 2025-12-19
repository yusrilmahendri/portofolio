import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar-components',
  imports: [CommonModule],
  standalone: true, 
  templateUrl: './navbar-components.html',
  styleUrl: './navbar-components.scss',
})
export class NavbarComponents implements OnInit, OnDestroy {
  activeSection = 'about';
  private scrollHandler?: () => void;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Only run in browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      // Throttle scroll events
      let ticking = false;
      const updateActiveSection = () => {
        const sections = ['about', 'experiences', 'projects', 'contact'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const offsetTop = element.offsetTop;
            const offsetHeight = element.offsetHeight;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              this.activeSection = section;
              break;
            }
          }
        }
      };

      this.scrollHandler = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateActiveSection();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
  }

  ngOnDestroy() {
    // Cleanup scroll listener
    if (isPlatformBrowser(this.platformId) && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  scrollToSection(section: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.activeSection = section;
      }
    }
  }

  downloadCV() {
    // Placeholder for CV download functionality
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://drive.google.com/file/d/1U9QvoavbbFwv0FcadG2CdugS0QWJxjhH/view?usp=sharing', '_blank');
    }
  }
}
