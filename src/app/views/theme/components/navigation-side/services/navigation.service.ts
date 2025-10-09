import { Injectable } from '@angular/core';
import { INavigationGroup } from '../models/navigation-item.model';
import { ENavigationType } from '../types/navigation.type';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  navigationList: INavigationGroup[];

  constructor() { }


  navigationListData(): void {
    this.navigationList = [
      {
        label: 'gp-1',
        listChild: [
          {
            type: ENavigationType.Link,
            label: 'میز کار من',
            permission: '',
            route: '/dashboard',
            icon: 'grid_view',
          },
          {
            type: ENavigationType.Link,
            label: 'گزارش فروش',
            permission: '',
            route: '/report',
            icon: 'assignment',
          },
          {
            type: ENavigationType.Link,
            label: 'زیرمجموعه ها',
            permission: '',
            route: '/sub',
            icon: 'account_box',
          },
          {
            type: ENavigationType.Link,
            label: 'امور مالی',
            permission: '',
            route: '/transactions',
            icon: 'percent',
          },
          {
            type: ENavigationType.Link,
            label: 'تنظیمات پروفایل',
            permission: '',
            route: '/settings',
            icon: 'settings',
          },
        ]
      },
    ];
  }

}
