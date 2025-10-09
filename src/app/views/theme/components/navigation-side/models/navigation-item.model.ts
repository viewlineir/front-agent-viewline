import { ENavigationType } from "../types/navigation.type";

export type INavigationItem = INavigationLink | INavigationDropdown;

export interface INavigationGroup {
  label: string;
  listChild: Array<INavigationLink | INavigationDropdown>;
}

export interface INavigationLink {
  type: ENavigationType.Link;
  route: string | any;
  label: string;
  icon?: string;
  permission: string;
  isActive?: boolean;
  isSvgIcon?: boolean;
  routerLinkActiveOptions?: { exact: boolean };
}

export interface INavigationDropdown {
  type: ENavigationType.Dropdown;
  label: string;
  icon?: string;
  permission: string;
  isActive?: boolean;
  isSvgIcon?: boolean;
  children: Array<INavigationLink | INavigationDropdown>;
}
