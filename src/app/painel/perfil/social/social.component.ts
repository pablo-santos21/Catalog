import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UpdateUserDTO } from '../../../DTOs/update-user-dto';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [FormsModule, ToastModule],
  templateUrl: './social.component.html',
  styleUrl: './social.component.css',
  providers: [MessageService],
})
export class SocialComponent implements OnInit {
  user: User | null = null;
  updateUserDTO: UpdateUserDTO = {};

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
    const userId = this.userService.getUserIdFromToken();

    if (userId) {
      this.userService.getUser().subscribe(
        (user) => {
          this.user = user;
          // Atualiza updateUserDTO com as redes sociais do usuário
          this.updateUserDTO = {
            tiktok: user.tiktok || '',
            facebook: user.facebook || '',
            twitter: user.twitter || '',
            youtube: user.youtube || '',
            instagram: user.instagram || '',
            whatsapp: user.whatsapp || '',
            otherSocial: user.otherSocial || '',
          };
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
        ...this.updateUserDTO,
        about: this.updateUserDTO.about || '',
        enterpriseName: this.updateUserDTO.enterpriseName || '',
        imagePerfil: this.updateUserDTO.imagePerfil || '',
        cellPhone: this.updateUserDTO.cellPhone || '',
        addressStreet: this.updateUserDTO.addressStreet || '',
        addressCity: this.updateUserDTO.addressCity || '',
        addressState: this.updateUserDTO.addressState || '',
        addressNumber: this.updateUserDTO.addressNumber || '',
        addressComplement: this.updateUserDTO.addressComplement || '',
        addressZipCode: this.updateUserDTO.addressZipCode || '',
        addressNeighborhood: this.updateUserDTO.addressNeighborhood || '',
        facebook: this.updateUserDTO.facebook || '',
        youtube: this.updateUserDTO.youtube || '',
        twitter: this.updateUserDTO.twitter || '',
        tiktok: this.updateUserDTO.tiktok || '',
        instagram: this.updateUserDTO.instagram || '',
        whatsapp: this.updateUserDTO.whatsapp || '',
        otherSocial: this.updateUserDTO.otherSocial || '',
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
