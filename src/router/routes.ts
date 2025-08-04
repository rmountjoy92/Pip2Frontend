import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', name: 'face', component: () => import('features/face/FacePage.vue') },
      {
        path: '/timer/:time',
        name: 'timer',
        component: () => import('features/timer/TimerPage.vue'),
      },
      {
        path: '/radar',
        name: 'radar',
        component: () => import('features/radar/RadarPage.vue'),
      },
      {
        path: '/stopwatch',
        name: 'stopwatch',
        component: () => import('features/stopwatch/StopwatchPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('features/errors/404Page.vue'),
  },
];

export default routes;
