import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { UpdateSocialDTO } from '../../../DTOs/update-social-dto';
import { User } from '../../../models/user';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
  updateSocialDto: UpdateSocialDTO = {};

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
          // Atualiza updateSocialDto com as redes sociais do usuário
          this.updateSocialDto = {
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
        ...this.updateSocialDto,
        about: this.updateSocialDto.about || '',
        enterpriseName: this.updateSocialDto.enterpriseName || '',
        imagePerfil: this.updateSocialDto.imagePerfil || '',
        cellPhone: this.updateSocialDto.cellPhone || '',
        addressStreet: this.updateSocialDto.addressStreet || '',
        addressCity: this.updateSocialDto.addressCity || '',
        addressState: this.updateSocialDto.addressState || '',
        addressNumber: this.updateSocialDto.addressNumber || '',
        addressComplement: this.updateSocialDto.addressComplement || '',
        addressZipCode: this.updateSocialDto.addressZipCode || '',
        facebook: this.updateSocialDto.facebook || '',
        youtube: this.updateSocialDto.youtube || '',
        twitter: this.updateSocialDto.twitter || '',
        tiktok: this.updateSocialDto.tiktok || '',
        instagram: this.updateSocialDto.instagram || '',
        whatsapp: this.updateSocialDto.whatsapp || '',
        otherSocial: this.updateSocialDto.otherSocial || '',
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
