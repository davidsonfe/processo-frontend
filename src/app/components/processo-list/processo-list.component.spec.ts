import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessoListComponent } from './processo-list.component';

describe('ProcessoListComponent', () => {
  let component: ProcessoListComponent;
  let fixture: ComponentFixture<ProcessoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
