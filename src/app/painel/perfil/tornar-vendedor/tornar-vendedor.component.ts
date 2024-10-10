import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../core/services/user.service';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
// O serviço que faz a chamada para o backend

@Component({
  selector: 'app-tornar-vendedor',
  standalone: true,
  imports: [ToastModule, CommonModule, ReactiveFormsModule],
  templateUrl: './tornar-vendedor.component.html',
  styleUrl: './tornar-vendedor.component.css',
  providers: [MessageService],
})
export class TornarVendedorComponent implements OnInit {
  changeRoleForm: FormGroup = this.fb.group({});
  availableRoles: string[] = ['Admin', 'Vendedor', 'Cliente', 'Moderador'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.changeRoleForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      roleName: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.changeRoleForm.valid) {
      const { email, roleName } = this.changeRoleForm.value;
      this.userService.addUserToRole(email, roleName).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        }
      );
    }
  }
}
