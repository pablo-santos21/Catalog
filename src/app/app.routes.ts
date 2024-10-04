//Angular
import { Routes } from '@angular/router';

//Layouts
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';

//Autenticação e autorização
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

//Website
import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { PrecosComponent } from './pages/precos/precos.component';
import { EventsComponent } from './pages/events/events.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

//Dashboard
import { DashboardComponent } from './painel/dashboard/dashboard.component';
import { PerfilComponent } from './painel/perfil/perfil.component';
import { EventTypeComponent } from './painel/event-type/event-type.component';
import { ProductsComponent } from './painel/products/products.component';
import { CategoriesComponent } from './painel/categories/categories.component';
import { EventosComponent } from './painel/eventos/eventos.component';
import { CadastrarProdutoComponent } from './painel/products/cadastrar-produto/cadastrar-produto.component';
import { CadastrarEventoComponent } from './painel/eventos/cadastrar-evento/cadastrar-evento.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';
import { TrocarSenhaComponent } from './painel/perfil/trocar-senha/trocar-senha.component';
import { SocialComponent } from './painel/perfil/social/social.component';
import { FornecedorComponent } from './painel/perfil/fornecedor/fornecedor.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Tesouros da Terra',
      },
      {
        path: 'eventos',
        component: EventsComponent,
        title: 'Eventos - Tesouros da Terra',
      },
      {
        path: 'produtos',
        component: ProdutosComponent,
        title: 'Produtos - Tesouros da Terra',
      },
      {
        path: 'sobre',
        component: SobreComponent,
        title: 'Sobre a Tesouros da Terra',
      },
      {
        path: 'precos',
        component: PrecosComponent,
        title: 'Planos - Tesouros da Terra',
      },
      {
        path: 'esqueceu-a-senha',
        component: ForgotpasswordComponent,
        title: 'Esqueci a senha - Tesouros da Terra',
      },
      {
        path: 'resetpassword',
        component: ResetpasswordComponent,
        title: 'Nova Senha - Tesouros da Terra',
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthenticatedGuard],
        title: 'Login - Tesouros da Terra',
      },
      {
        path: 'registrar',
        component: RegisterComponent,
        canActivate: [AuthenticatedGuard],
        title: 'Registrar-se - Tesouros da Terra',
      },
    ],
  },
  // {
  //   path: '',
  //   component: DashboardLayoutComponent,
  //   children: [
  //     {
  //       path: 'formulario',
  //       component: FormulariosComponent,
  //       title: 'formulário - Tesouros da Terra',
  //     },
  //     {
  //       path: 'cad-produto',
  //       component: ProductsComponent,
  //       title: 'produtos',
  //     },
  //     {
  //       path: 'cadastrar-produto',
  //       component: CadastrarProdutoComponent,
  //       title: 'formulario',
  //     },
  //     {
  //       path: 'editar-produto',
  //       component: EditarProdutoComponent,
  //       title: 'formulario',
  //     },
  //   ],
  // },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard - Tesouros da Terra',
      },
      {
        path: 'listar-eventos',
        component: EventosComponent,
        title: 'Cadastrar Eventos - Tesouros da Terra',
      },
      {
        path: 'cadastrar-evento',
        component: CadastrarEventoComponent,
        title: 'Cadastrar Eventos - Tesouros da Terra',
      },
      {
        path: 'tipo-de-evento',
        component: EventTypeComponent,
        title: 'Cadastrar tipos de eventos - Tesouros da Terra',
      },
      {
        path: 'cadastrar-produto',
        component: CadastrarProdutoComponent,
        title: 'Cadastrar Produtos - Tesouros da Terra',
      },
      {
        path: 'listar-produtos',
        component: ProductsComponent,
        title: 'Listar Produtos - Tesouros da Terra',
      },
      {
        path: 'categorias',
        component: CategoriesComponent,
        title: 'Cadastrar Categorias - Tesouros da Terra',
      },
      {
        path: 'perfil',
        component: PerfilComponent,
        title: 'Meu Perfil - Tesouros da Terra',
      },
      {
        path: 'trocar-senha',
        component: TrocarSenhaComponent,
        title: 'trocar senha - Tesouros da Terra',
      },
      {
        path: 'redes-sociais',
        component: SocialComponent,
        title: 'Minhas Redes - Tesouros da Terra',
      },
      {
        path: 'vendedor',
        component: FornecedorComponent,
        title: 'Troca de cargo - Tesouros da Terra',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
