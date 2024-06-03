import { Component, ElementRef, OnInit, Renderer2, ViewChild, effect } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @ViewChild('mobileMenu') mobileMenu: ElementRef | undefined;

  body = document.body;
  isMobileMenuShown: boolean = false;

  constructor(
    public readonly authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.body.style.overflow = '';
        this.isMobileMenuShown = false;
        this.renderer.setStyle(this.mobileMenu?.nativeElement, 'display', 'none');
      }

    })
  }

  onLogout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  mobileMenuToggle() {

    this.isMobileMenuShown = !this.isMobileMenuShown;

    if (this.isMobileMenuShown) {
      this.renderer.setStyle(this.mobileMenu?.nativeElement, 'display', 'block')
      this.body.style.overflow = 'hidden';
    } else {
      this.body.style.overflow = '';
      this.renderer.setStyle(this.mobileMenu?.nativeElement, 'display', 'none');
    }
  }

  dropdownToggle(dropdown: HTMLElement) {
    const display = dropdown.style.display;
    const isToggled = display === '' || display === 'none';

    isToggled
      ? this.renderer.setStyle(dropdown, 'display', 'block')
      : this.renderer.setStyle(dropdown, 'display', 'none')
  }
}
