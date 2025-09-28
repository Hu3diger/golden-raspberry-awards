import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentPage).toBe(0);
    expect(component.totalPages).toBe(0);
    expect(component.size).toBe(10);
    expect(component.totalElements).toBe(0);
  });

  it('should calculate start record correctly', () => {
    component.currentPage = 1;
    component.size = 10;
    
    expect(component.startRecord).toBe(11);
  });

  it('should calculate end record correctly', () => {
    component.currentPage = 1;
    component.size = 10;
    component.totalElements = 25;
    
    expect(component.endRecord).toBe(20);
  });

  it('should calculate end record for last page correctly', () => {
    component.currentPage = 2;
    component.size = 10;
    component.totalElements = 25;
    
    expect(component.endRecord).toBe(25);
  });

  it('should generate visible pages array', () => {
    component.currentPage = 3;
    component.totalPages = 10;
    component.ngOnChanges();
    
    expect(component.visiblePages.length).toBeGreaterThan(0);
    expect(component.visiblePages).toContain(3);
  });

  it('should emit pageChange when onPageChange is called with valid page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.totalPages = 5;
    
    component.onPageChange(2);
    
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit pageChange when onPageChange is called with same page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.totalPages = 5;
    
    component.onPageChange(2);
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should not emit pageChange when onPageChange is called with invalid page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.totalPages = 5;
    
    component.onPageChange(-1);
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should not emit pageChange when onPageChange is called with page >= totalPages', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.totalPages = 5;
    
    component.onPageChange(5);
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should generate visible pages correctly for start pages', () => {
    component.currentPage = 1;
    component.totalPages = 10;
    component.ngOnChanges();
    
    expect(component.visiblePages).toEqual([0, 1, 2, 3, 4]);
  });

  it('should generate visible pages correctly for middle pages', () => {
    component.currentPage = 5;
    component.totalPages = 10;
    component.ngOnChanges();
    
    expect(component.visiblePages).toEqual([3, 4, 5, 6, 7]);
  });

  it('should generate visible pages correctly for end pages', () => {
    component.currentPage = 8;
    component.totalPages = 10;
    component.ngOnChanges();
    
    expect(component.visiblePages).toEqual([5, 6, 7, 8, 9]);
  });

  it('should update visible pages when inputs change', () => {
    component.currentPage = 0;
    component.totalPages = 10;
    component.ngOnChanges();
    
    const initialPages = [...component.visiblePages];
    
    component.currentPage = 7;
    component.ngOnChanges();
    
    expect(component.visiblePages).not.toEqual(initialPages);
  });

  it('should display correct record range info', () => {
    component.currentPage = 1;
    component.size = 10;
    component.totalElements = 25;
    
    expect(component.startRecord).toBe(11);
    expect(component.endRecord).toBe(20);
  });
});
