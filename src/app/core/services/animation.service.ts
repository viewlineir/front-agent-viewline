import { animate, style, transition, trigger } from '@angular/animations';

export const slideOfLeftAnimation = trigger('slideOfLeftAnimation', [
    transition(':enter', [
        style({ paddingRight: '40px' }), animate('300ms', style({ paddingRight: '8px' }))]
    ),
    transition(':leave',
        [style({ paddingRight: '40px' }), animate('300ms', style({ paddingRight: '8px' }))]
    )
]);
export const slideOfRightAnimation = trigger('slideOfRightAnimation', [
    transition(':enter', [
        style({ paddingLeft: '40px' }), animate('300ms', style({ paddingLeft: '8px' }))]
    ),
    transition(':leave',
        [style({ paddingLeft: '40px' }), animate('300ms', style({ paddingLeft: '8px' }))]
    )
]);

export const transformOfTopAnimation = trigger('transformOfTopAnimation', [
    transition(':enter', [
        style({ transform: 'translateY(-50px)' }), animate('300ms', style({ transform: 'translateY(0)' }))]
    ),
    transition(':leave',
        [style({ transform: 'translateY(-50px)' }), animate('300ms', style({ transform: 'translateY(0)' }))]
    )
]);

export const transformOfBottomAnimation = trigger('transformOfBottomAnimation', [
    transition(':enter', [
        style({ transform: 'translateY(10px)' }), animate('300ms', style({ transform: 'translateY(0)' }))]
    ),
    transition(':leave',
        [style({ transform: 'translateY(10px)' }), animate('300ms', style({ transform: 'translateY(0)' }))]
    )
]);

export const transformOfLeftAnimation = trigger('transformOfLeftAnimation', [
    transition(':enter', [
        style({ transform: 'translateX(-50px)' }), animate('300ms', style({ transform: 'translateX(0)' }))]
    ),
    transition(':leave',
        [style({ transform: 'translateX(-50px)' }), animate('300ms', style({ transform: 'translateX(0)' }))]
    )
]);

export const transformOfRightAnimation = trigger('transformOfRightAnimation', [
    transition(':enter', [
        style({ transform: 'translateX(50px)' }), animate('300ms', style({ transform: 'translateX(0)' }))]
    ),
    transition(':leave',
        [style({ transform: 'translateX(50px)' }), animate('300ms', style({ transform: 'translateX(0)' }))]
    )
]);

export const fadeInAnimation = trigger('fadeInAnimation', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('.3s', style({ opacity: 1 }))
    ]),
]);