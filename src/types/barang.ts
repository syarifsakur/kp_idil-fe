export interface Barang {
  uuid: string;               // ID unik barang (biasanya dari database)
  kode_barang: string;        // Kode unik barang (misal: BRG-001)
  nama_barang: string;        // Nama barang (misal: Laptop Lenovo)
  kategori: string;           // Kategori barang (misal: Elektronik, Alat Kantor)
  jumlah: number;             // Jumlah stok barang yang tersedia
  kondisi: string;            // Kondisi barang (Baik, Rusak, dll)
  lokasi: string;             // Lokasi barang disimpan (misal: Gudang A)
  keterangan?: string;        // Keterangan tambahan (opsional)
  createdAt: string;          // Tanggal data dibuat
  updatedAt?: string;         // Tanggal data diperbarui (opsional)
}
