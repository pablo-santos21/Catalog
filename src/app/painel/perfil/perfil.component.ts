import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { UpdateUserDTO } from '../../DTOs/update-user-dto';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, ToastModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [MessageService],
})
export class PerfilComponent implements OnInit {
  user: User | null = null;
  updateUserDto: UpdateUserDTO = {
    nome: '',
    email: '',
    cellPhone: '',
    about: '',
    enterpriseName: '',
    imagePerfil: '',
    addressCity: '',
    addressState: '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressZipCode: '',
  };
  editMode = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria salva com sucesso!',
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Deletado',
      detail: 'Categoria deletada!',
    });
  }

  private loadUserInfo(): void {
    const userId = this.userService.getUserInfoFromToken();
    if (userId) {
      this.userService.getUser().subscribe(
        (user) => {
          this.user = user;
          // Atualiza updateUserDto com dados do usuário
          this.updateUserDto = { ...user }; // Atribui diretamente os dados do usuário
        },
        (error) => {
          console.error('Erro ao buscar informações do usuário:', error);
        }
      );
    } else {
      console.error('Usuário não autenticado');
    }
  }

  onSubmit() {
    const userId = this.userService.getUserIdFromToken();

    if (userId) {
      const updateDto = {
        ...this.updateUserDto,
        about: this.updateUserDto.about || '',
        enterpriseName: this.updateUserDto.enterpriseName || '',
        imagePerfil: this.updateUserDto.imagePerfil || '',
        cellPhone: this.updateUserDto.cellPhone || '',
        addressStreet: this.updateUserDto.addressStreet || '',
        addressCity: this.updateUserDto.addressCity || '',
        addressState: this.updateUserDto.addressState || '',
        addressNumber: this.updateUserDto.addressNumber || '',
        addressComplement: this.updateUserDto.addressComplement || '',
        addressZipCode: this.updateUserDto.addressZipCode || '',
        facebook: this.updateUserDto.facebook || '',
        youtube: this.updateUserDto.youtube || '',
        twitter: this.updateUserDto.twitter || '',
        tiktok: this.updateUserDto.tiktok || '',
        instagram: this.updateUserDto.instagram || '',
        whatsapp: this.updateUserDto.whatsapp || '',
        otherSocial: this.updateUserDto.otherSocial || '',
      };

      this.userService.updateSocial(userId, updateDto).subscribe(
        (response) => {
          console.log('Informações atualizadas com sucesso!', response);
          this.showSuccess();
        },
        (error) => {
          console.error('Erro ao atualizar informações:', error);
          this.showError();
        }
      );
    } else {
      console.error('ID do usuário não pode ser nulo');
    }
  }
}
