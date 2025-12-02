import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile';

@Component({
  selector: 'app-advertisers-dashboard',
  templateUrl: './advertisers.html',
  styleUrls: ['./advertisers.css'],
  standalone: true,
  imports: [CommonModule, ProfileComponent]
})
export class AdvertisersDashboardComponent implements OnInit {
  stats = {
    totalCampaigns: 24,
    activeCampaigns: 12,
    totalSpend: 145000,
    impressions: 2500000
  };

  recentCampaigns = [
    { name: 'Summer Sale 2024', status: 'Active', budget: 15000, spent: 8500 },
    { name: 'Product Launch', status: 'Active', budget: 25000, spent: 18000 },
    { name: 'Brand Awareness', status: 'Paused', budget: 10000, spent: 5500 },
    { name: 'Holiday Special', status: 'Completed', budget: 20000, spent: 20000 }
  ];

  menuOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  createCampaign(): void {
    console.log('Create new campaign');
  }

  viewCampaign(campaign: any): void {
    console.log('View campaign:', campaign);
  }

  handleLogout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}