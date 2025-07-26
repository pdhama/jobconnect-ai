import { spawn } from 'child_process';

export async function runOllama(model: string, prompt: string, timeoutMs = 15000): Promise<string> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const proc = spawn('ollama', ['run', model], { stdio: ['pipe', 'pipe', 'inherit'] });
    let output = '';
    let finished = false;

    proc.stdout.on('data', (data) => { output += data.toString(); });
    proc.on('close', (code) => {
      finished = true;
      const duration = Date.now() - start;
      console.log(`[Ollama] model=${model} duration_ms=${duration}`);
      if (code === 0) resolve(output);
      else reject(new Error(`Ollama exited with code ${code}`));
    });

    proc.stdin.write(prompt);
    proc.stdin.end();

    setTimeout(() => {
      if (!finished) {
        proc.kill();
        reject(new Error('Ollama call timed out'));
      }
    }, timeoutMs);
  });
}
