// src/data/questions.js
const questions = [
  {
    id: 1,
    text: "Apa tujuan utama rehabilitasi narkoba?",
    options: [
      { value: "wrong1", label: "Memberikan efek jera melalui pembinaan agar pengguna tidak mengulangi perbuatannya" },
      { value: "correct", label: "Memulihkan kondisi fisik, mental, dan sosial pengguna agar dapat kembali berfungsi di masyarakat" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 2,
    text: "Tahap pertama dalam rehabilitasi medis adalah?",
    options: [
      { value: "wrong1", label: "Terapi kelompok dan konseling untuk membangun motivasi awal pasien" },
      { value: "correct", label: "Detoksifikasi, yaitu proses pembersihan racun dari dalam tubuh" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 3,
    text: "Peran keluarga dalam rehabilitasi adalah?",
    options: [
      { value: "correct", label: "Memberikan dukungan emosional, motivasi, serta menciptakan lingkungan yang positif" },
      { value: "wrong1", label: "Menerapkan aturan ketat dan hukuman untuk setiap kesalahan agar pengguna jera" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 4,
    text: "Dampak jangka panjang penggunaan narkoba jenis heroin pada sistem saraf pusat adalah?",
    options: [
      { value: "wrong1", label: "Meningkatkan fungsi kognitif karena tubuh beradaptasi dengan zat tersebut" },
      { value: "correct", label: "Kerusakan reseptor dopamin serta gangguan fungsi kognitif yang menetap" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 5,
    text: "Menurut UU No. 35 Tahun 2009 tentang Narkotika, bagaimana pendekatan terhadap pecandu dan korban penyalahgunaan narkotika?",
    options: [
      { value: "wrong1", label: "Dapat dipidana, namun rehabilitasi diberikan setelah menjalani hukuman penjara" },
      { value: "correct", label: "Wajib menjalani rehabilitasi medis dan rehabilitasi sosial" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 6,
    text: "Apa itu terapi kognitif perilaku (CBT)?",
    options: [
      { value: "wrong1", label: "Pemberian obat-obatan untuk menekan gejala putus zat pada pengguna" },
      { value: "correct", label: "Terapi yang berfokus pada perubahan pola pikir dan perilaku yang maladaptif" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 7,
    text: "BNN (Badan Narkotika Nasional) memiliki kewenangan utama dalam?",
    options: [
      { value: "wrong1", label: "Menangani seluruh kasus narkoba mulai dari penyelidikan hingga rehabilitasi korban" },
      { value: "correct", label: "Pencegahan, pemberantasan penyalahgunaan, dan peredaran gelap narkotika" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 8,
    text: "Bagaimana cara mencegah relaps (kambuh)?",
    options: [
      { value: "correct", label: "Menghindari pemicu (trigger) dan membangun dukungan sosial yang kuat" },
      { value: "wrong1", label: "Mengisolasi diri dari lingkungan sosial agar tidak terpapar zat tersebut" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 9,
    text: "Mengapa seseorang yang sudah 'bersih' dari narkoba selama berbulan-bulan masih bisa mengalami keinginan kuat (craving) ketika melihat tempat tertentu?",
    options: [
      { value: "wrong1", label: "Karena keinginan tersebut menunjukkan kelemahan moral yang belum sepenuhnya teratasi" },
      { value: "correct", label: "Karena adiksi mengubah struktur otak yang berkaitan dengan memori dan asosiasi lingkungan" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 10,
    text: "Kapan rehabilitasi rawat jalan menjadi pilihan yang tepat untuk seseorang?",
    options: [
      { value: "wrong1", label: "Saat kecanduan berat dengan gejala putus zat yang mengancam jiwa" },
      { value: "correct", label: "Saat kondisi kecanduan ringan hingga sedang dan lingkungan rumah mendukung" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 11,
    text: "Apa perbedaan utama Intervensi Berbasis Masyarakat (IBM) dengan pendekatan penegakan hukum dalam penanganan narkotika?",
    options: [
      { value: "wrong1", label: "IBM menggantikan seluruh peran penegakan hukum dalam menangani kasus narkotika" },
      { value: "correct", label: "IBM melibatkan partisipasi aktif masyarakat untuk pencegahan dan rehabilitasi, bukan hanya penindakan" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 12,
    text: "Faktor apa yang menentukan apakah seseorang memerlukan rehabilitasi rawat inap atau cukup rawat jalan?",
    options: [
      { value: "wrong1", label: "Jenis narkoba yang digunakan menentukan seluruh keputusan rehabilitasi tanpa melihat kondisi pasien" },
      { value: "correct", label: "Tingkat keparahan kecanduan, stabilitas kondisi medis, dan dukungan lingkungan rumah" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 13,
    text: "Apa yang dimaksud dengan Adiksi?",
    options: [
      { value: "wrong1", label: "Kebiasaan mengonsumsi zat tertentu yang dapat dihentikan kapan saja sesuai keinginan" },
      { value: "correct", label: "Kondisi ketergantungan fisik dan psikologis terhadap zat atau perilaku tertentu" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 14,
    text: "Apa yang dimaksud dengan coping strategy dalam rehabilitasi narkotika?",
    options: [
      { value: "correct", label: "Cara mengelola stres, emosi negatif, dan godaan agar tidak kembali menggunakan narkotika" },
      { value: "wrong1", label: "Mekanisme pertahanan diri yang muncul secara tidak sadar untuk melindungi diri dari kecemasan" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  },
  {
    id: 15,
    text: "Program Aftercare pasca rehabilitasi penting dilakukan untuk?",
    options: [
      { value: "wrong1", label: "Menghentikan seluruh bentuk terapi setelah masa rehabilitasi utama selesai" },
      { value: "correct", label: "Memantau dan mendukung klien untuk mencegah terjadinya relaps dalam jangka panjang" },
      { value: "tidak_tahu", label: "Tidak tahu" }
    ]
  }
];

export default questions;