import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { PodcastList } from './podcast-list';

describe('PodcastList', () => {
  let component: PodcastList;
  let fixture: ComponentFixture<PodcastList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastList],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
