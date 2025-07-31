import { Model, Query, Document } from 'mongoose';
import { PaginationDto } from 'src/dtos/pagination/pagination.dto';
import { PaginatedResponseDto } from 'src/dtos/pagination/pagination-response.dto';

export interface PopulateConfig {
  path: string;
  select?: string;
  model?: string;
  as?: string;
}

export async function paginate<T extends Document>(
  model: Model<T>,
  paginationDto: PaginationDto,
  initialQuery: any = {},
  initialProjection: any = {},
  populateConfigs: PopulateConfig[] = [],
): Promise<PaginatedResponseDto<T>> {
  const page = paginationDto.page || 1;
  const limit = paginationDto.limit || 10;
  const skip = (page - 1) * limit;

  const finalQuery = { ...initialQuery };

  if (paginationDto.search && paginationDto.searchField) {
    if (
      typeof paginationDto.searchField === 'string' &&
      paginationDto.searchField.length > 0
    ) {
      finalQuery[paginationDto.searchField] = {
        $regex: paginationDto.search,
        $options: 'i',
      };
    } else {
      console.warn('Invalid searchField provided in paginationDto.');
    }
  }

  // --- Kueri untuk Data (dengan Populate) ---
  let mongooseQuery: Query<T[], T> = model.find(finalQuery);

  const fieldsToRemoveAfterPopulate: string[] = [];

  // PENTING: Pastikan loop ini dieksekusi dan populasinya benar
  for (const config of populateConfigs) {
    if (config.path) {
      // Memastikan path ada
      const populateOptions: any = {
        path: config.path,
        select: config.select,
        model: config.model, // Pastikan ini sesuai dengan nama model yang didaftarkan
      };

      if (config.as) {
        populateOptions.as = config.as;
        // Hanya tambahkan ke daftar untuk dihapus jika 'as' digunakan
        fieldsToRemoveAfterPopulate.push(config.path);
      }

      // Pastikan mongooseQuery di-update di setiap iterasi
      mongooseQuery = mongooseQuery.populate(populateOptions);
      console.log(
        `DEBUG: Applying populate for path: ${config.path}, as: ${config.as || config.path}`,
      );
    } else {
      console.warn('DEBUG: PopulateConfig has no path:', config);
    }
  }

  // DEBUG: Periksa apakah populateConfigs sudah diterapkan ke kueri
  // (Note: tidak ada cara langsung untuk melihat populasi di objek Query Mongoose,
  // tapi ini akan membantu memastikan logika di atas dieksekusi)
  if (populateConfigs.length > 0) {
    console.log(
      `DEBUG: ${populateConfigs.length} populate configurations processed.`,
    );
  }

  const finalProjection = { ...initialProjection };
  fieldsToRemoveAfterPopulate.forEach((field) => {
    finalProjection[field] = 0; // Setel ke 0 untuk menghapus field ID asli
  });

  // Terapkan proyeksi akhir setelah semua populate dikonfigurasi
  mongooseQuery = mongooseQuery.select(finalProjection);

  // DEBUG: Tampilkan proyeksi akhir yang diterapkan
  console.log('DEBUG: Final Projection applied:', finalProjection);

  const [data, totalItems] = await Promise.all([
    mongooseQuery.skip(skip).limit(limit).exec(),
    model.countDocuments(finalQuery).exec(),
  ]);

  // DEBUG: Tampilkan data mentah setelah eksekusi kueri
  // console.log('DEBUG: Raw data after query execution:', data);

  const mappedData = data.map((item) => {
    const obj = item.toObject({ getters: true, virtuals: true });
    // DEBUG: Tampilkan setiap objek yang di-map
    // console.log('DEBUG: Mapped object:', obj);
    return obj;
  });

  return new PaginatedResponseDto<T>(
    mappedData as T[],
    totalItems,
    page,
    limit,
  );
}
