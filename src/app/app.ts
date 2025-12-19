import { Component, signal, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponents } from './navbar-components/navbar-components';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    NavbarComponents,
    CommonModule
  ],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('my-portofolio');
  
  profileImageSrc = 'assets/images/yusril-mahendri.png';
  fallbackImageSrc = 'https://via.placeholder.com/300x400/1a1a2e/FFFFFF?text=Yusril+Mahendri';
  imageErrorHandled = false;
  
  techStacks = [
    { name: 'Html', icon: 'bi-code-slash', color: '#3776AB' },
    { name: 'CSS / SCSS', icon: 'bi-code-slash', color: '#3776AB' },
    { name: 'JavaScript', icon: 'bi-code-slash', color: '#F7DF1E' },
    { name: 'Python', icon: 'bi-code-slash', color: '#3776AB' },
    { name: 'TypeScript', icon: 'bi-code-slash', color: '#3178C6' },
    { name: 'PHP', icon: 'bi-code-slash', color: '#777BB4' },
    { name: 'Go', icon: 'bi-code-slash', color: '#20b1ffff' },
    { name: 'Angular', icon: 'bi-code-slash', color: '#DD0031' },
    { name: 'Bootstrap', icon: 'bi-code-slash', color: '#DD0031' },
    { name: 'Laravel', icon: 'bi-code-slash', color: '#339933' },
    { name: 'Lumen', icon: 'bi-code-slash', color: '#4FC08D' }
  ];

  private observer?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Duplicate tech stacks for seamless infinite scroll
    this.techStacks = [...this.techStacks, ...this.techStacks];
  }

  ngAfterViewInit() {
    // Only run in browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      // Intersection Observer for fade-in animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            // Stop observing once visible to prevent re-triggering
            this.observer?.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe all sections
      setTimeout(() => {
        document.querySelectorAll('.fade-in-section').forEach(section => {
          this.observer?.observe(section);
        });
      }, 100);
    }
  }

  ngOnDestroy() {
    // Cleanup Intersection Observer
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  onImageError(event: Event) {
    if (!this.imageErrorHandled) {
      const img = event.target as HTMLImageElement;
      if (img.src !== this.fallbackImageSrc) {
        img.src = this.fallbackImageSrc;
        this.imageErrorHandled = true;
      }
    }
  }
}
