import { Routes } from '@angular/router';
import { Login } from '@features/auth/pages/login/login';
import { Register } from '@features/auth/pages/register/register';
import { Recetas } from '@features/recipes/pages/recetas/recetas';
import { MisRecetas } from '@features/recipes/pages/mis-recetas/mis-recetas';
import { RecetaDetalle } from '@features/recipes/pages/receta-detalle/receta-detalle';
import { CrearReceta } from '@features/recipes/pages/crear-receta/crear-receta';
import { Buscar } from '@features/search/pages/buscar/buscar';
import { Perfil } from '@features/profile/pages/perfil/perfil';
import { Configuracion } from '@features/profile/pages/configuracion/configuracion';
import { Listas } from '@features/lists/pages/listas/listas';
import { ListaDetalle } from '@features/lists/pages/lista-detalle/lista-detalle';
import { ParaTi } from '@features/feed/pages/para-ti/para-ti';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'mis-recetas', component: MisRecetas, canActivate: [authGuard] },
  { path: 'buscar', component: Buscar, canActivate: [authGuard] },
  { path: 'recetas/nueva', component: CrearReceta, canActivate: [authGuard] },
  { path: 'recetas/:id/editar', component: CrearReceta, canActivate: [authGuard] },
  { path: 'recetas/:id', component: RecetaDetalle, canActivate: [authGuard] },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'perfil/:id', component: Perfil, canActivate: [authGuard] },
  { path: 'listas', component: Listas, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'listas/:id', component: ListaDetalle, canActivate: [authGuard] },
  { path: 'para-ti', component: ParaTi, canActivate: [authGuard] },
  { path: 'register', component: Register },
  { path: 'configuracion', component: Configuracion, canActivate: [authGuard] }
];