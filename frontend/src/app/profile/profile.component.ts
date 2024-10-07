import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../core/service/user.service';
import { User } from '../core/models/user.model';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  showEditForm: boolean = false; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((userData: User | null) => {
      this.user = userData;
    });
  }

 // Método para actualizar los campos de perfil
 updateProfile(updatedFields: Partial<User>) {
  if (this.user) {
    const updatedUser = { ...this.user, ...updatedFields };
    this.userService.update(updatedUser).subscribe(updated => {
      this.user = updated; // Actualiza la información local del usuario
    });
  }
}

// Método para alternar la visibilidad del formulario de edición
toggleEditForm(): void {
  this.showEditForm = !this.showEditForm;
}
}
