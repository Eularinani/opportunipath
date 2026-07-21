import { runScraper } from '@/lib/scraper/engine';

async function main() {
  console.log('🚀 Iniciando importação automática de bolsas...\n');

  try {
    const results = await runScraper();

    console.log('\n📊 Resultados:');
    for (const r of results) {
      console.log(`  • ${r.fonte}: ${r.total} encontradas | ${r.novas} novas | ${r.atualizadas} atualizadas | ${r.falhas} falhas`);
    }

    const totalFalhas = results.reduce((sum, r) => sum + r.falhas, 0);
    if (totalFalhas > 0) {
      console.warn(`\n⚠️ ${totalFalhas} falhas registadas.`);
      process.exit(1);
    }

    console.log('\n✅ Importação concluída com sucesso.');
  } catch (err) {
    console.error('\n❌ Erro fatal na importação:', err);
    process.exit(1);
  }
}

main();
